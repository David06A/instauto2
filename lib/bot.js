"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instauto = exports.InstautoCtr = void 0;
const assert_1 = __importDefault(require("assert"));
const user_agents_1 = __importDefault(require("user-agents"));
const path_1 = require("path");
const promises_1 = require("fs/promises");
const core_1 = require("./core");
function shuffleArray(arrayIn) {
    const array = [...arrayIn];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
class InstautoCtr {
    constructor(db, browser, options) {
        this.db = db;
        this.browser = browser;
        this.options = options;
        this.botWorkShiftHours = 16;
        this.dayMs = 24 * 60 * 60 * 1000;
        this.hourMs = 60 * 60 * 1000;
        this.graphqlUserMissing = false;
    }
    get sleep() {
        return core_1.Utils.sleep;
    }
    async setup() {
        await this.initContext();
        if (this.options.randomizeUserAgent) {
            const userAgentGenerated = new user_agents_1.default({ deviceCategory: 'desktop' });
            await this.page.setUserAgent(userAgentGenerated.toString());
        }
        if (this.options.userAgent)
            await this.page.setUserAgent(this.options.userAgent);
        if (this.options.enableCookies)
            await this.tryLoadCookies();
        await this.page.goto(`${this.options.instagramBaseUrl}/`);
        await core_1.Utils.sleep(1000);
        this.logger.log(core_1.languageManager.messages.settingInstagramLanguage);
        await this.page.setCookie({ name: 'ig_lang', path: '/', value: 'en', });
        await core_1.Utils.sleep(1000);
        await this.page.goto(`${this.options.instagramBaseUrl}/`);
        await core_1.Utils.sleep(3000);
        await this.instagramApi.tryPressAcceptCookies();
        if (!(await this.instagramApi.isLoggedIn())) {
            if (!this.options.username || !this.options.password) {
                await this.tryDeleteCookies();
                throw new Error('No longer logged in. Deleting cookies and aborting. Need to provide username/password');
            }
            try {
                await this.instagramApi.tryPressAuthSwitcher();
                await core_1.Utils.sleep(1000);
            }
            catch (err) {
                this.logger.warn(core_1.languageManager.messages.logginPageButtonNotFound);
            }
            await this.instagramApi.tryToLogin(this.options.username, this.options.password);
            if (!(await this.instagramApi.isLoggedIn())) {
                await core_1.Utils.sleep(5000);
                this.logger.log(core_1.languageManager.messages.stillNotLoggedIn);
                await this.page.reload();
                await core_1.Utils.sleep(5000);
            }
            let warnedAboutLoginFail = false;
            while (!(await this.instagramApi.isLoggedIn())) {
                if (!warnedAboutLoginFail)
                    this.logger.warn(core_1.languageManager.messages.loginFailed);
                warnedAboutLoginFail = true;
                await core_1.Utils.sleep(5000);
            }
            await this.instagramApi.tryPressSaveLogInInfo();
        }
        await this.instagramApi.tryPressNotNowNotificationDialog();
        await this.trySaveCookies();
        const numLikes = (await this.db.getLikedPhotosLastTimeUnit(this.dayMs)).length;
        const numFollowedUnfollowedUsersLastHour = await this.getNumFollowedUsersThisTimeUnit(this.hourMs);
        const numFollowedUnfollowedUsersLastDay = await this.getNumFollowedUsersThisTimeUnit(this.dayMs);
        this.logger.log(core_1.languageManager.messages.haveFollowedInTheLastHour(numFollowedUnfollowedUsersLastHour));
        this.logger.log(core_1.languageManager.messages.haveFollowedInTheLastDay(numFollowedUnfollowedUsersLastDay));
        this.logger.log(core_1.languageManager.messages.haveLikedImagesInTheLastDay(numLikes));
        try {
            const detectedUsername = await this.page.evaluate(() => window._sharedData.config.viewer.username);
            if (detectedUsername)
                this.options.username = detectedUsername;
        }
        catch (err) {
            this.logger.error(core_1.languageManager.messages.usernameDetectionFailed, err);
        }
    }
    async tryLoadCookies() {
        try {
            const cookiesBuffer = await (0, promises_1.readFile)(this.options.cookiesPath);
            const cookies = JSON.parse(cookiesBuffer.toString());
            for (const cookie of cookies) {
                if (cookie.name !== 'ig_lang')
                    await this.page.setCookie(cookie);
            }
        }
        catch (err) {
            this.logger.error(core_1.languageManager.messages.noCookiesFound);
        }
    }
    async trySaveCookies() {
        try {
            this.logger.log(core_1.languageManager.messages.savingCookies);
            const cookies = await this.page.cookies();
            await (0, promises_1.writeFile)(this.options.cookiesPath, JSON.stringify(cookies, null, 2));
        }
        catch (err) {
            this.logger.error(core_1.languageManager.messages.savingCookiesFailed);
        }
    }
    async tryDeleteCookies() {
        try {
            this.logger.log(core_1.languageManager.messages.deletingCookies);
            await (0, promises_1.unlink)(this.options.cookiesPath);
        }
        catch (err) {
            this.logger.error(core_1.languageManager.messages.deletingCookiesFailed);
        }
    }
    async followUsersFollowers({ usersToFollowFollowersOf, maxFollowsTotal = 150, skipPrivate, enableLikeImages = false, likeImagesMin = 1, likeImagesMax = 2 }) {
        if (!maxFollowsTotal || maxFollowsTotal <= 2) {
            throw new Error(`Invalid parameter maxFollowsTotal ${maxFollowsTotal}`);
        }
        const usersToFollowFollowersOfSliced = shuffleArray(usersToFollowFollowersOf).slice(0, maxFollowsTotal);
        const maxFollowsPerUser = Math.floor(maxFollowsTotal / usersToFollowFollowersOfSliced.length) + 1;
        for (const username of usersToFollowFollowersOfSliced) {
            try {
                await this.followUserFollowers(username, {
                    enableLikeImages,
                    likeImagesMax,
                    likeImagesMin,
                    maxFollowsPerUser,
                    skipPrivate,
                });
                await core_1.Utils.sleep(10 * 60 * 1000);
                await this.throttle();
            }
            catch (err) {
                console.error('Failed to follow user followers, continuing', err);
                await this.takeScreenshot();
                await core_1.Utils.sleep(60 * 1000);
            }
        }
    }
    async followCurrentUser(username) {
        const elementHandle = await this.instagramApi.getFollowButton();
        if (!elementHandle) {
            if (await this.instagramApi.getUnfollowButton()) {
                this.logger.log(core_1.languageManager.messages.alreadyFollowingUser);
                await core_1.Utils.sleep(5000);
                return;
            }
            throw new Error('Follow button not found');
        }
        this.logger.log(core_1.languageManager.messages.followingUser(username));
        if (!this.options.dryRun) {
            await elementHandle.click();
            await core_1.Utils.sleep(5000);
            await this.checkActionBlocked();
            const elementHandle2 = await this.instagramApi.getUnfollowButton();
            const entry = { time: new Date().getTime(), username };
            if (!elementHandle2)
                entry.failed = true;
            await this.db.addPrevFollowedUser(entry);
            if (!elementHandle2) {
                this.logger.log(core_1.languageManager.messages.buttonStateUnchanged);
                await core_1.Utils.sleep(60000);
                throw new Error(core_1.languageManager.messages.buttonStateUnchanged);
            }
        }
        await core_1.Utils.sleep(1000);
    }
    async unfollowCurrentUser(username) {
        this.logger.log(core_1.languageManager.messages.unfollowingUser(username));
        const res = { time: new Date().getTime(), username };
        const elementHandle = await this.instagramApi.getUnfollowButton();
        if (!elementHandle) {
            const elementHandle2 = await this.instagramApi.getFollowButton();
            if (elementHandle2) {
                this.logger.log(core_1.languageManager.messages.alreadyUnfollowUser);
                res.noActionTaken = true;
            }
            else {
                this.logger.log(core_1.languageManager.messages.unfollowingUserFailed);
                res.noActionTaken = true;
            }
        }
        if (!this.options.dryRun) {
            if (elementHandle) {
                await elementHandle.click();
                await core_1.Utils.sleep(1000);
                const confirmHandle = await this.instagramApi.getUnfollowConfirmButton();
                if (confirmHandle)
                    await confirmHandle.click();
                await core_1.Utils.sleep(5000);
                await this.checkActionBlocked();
                const elementHandle2 = await this.instagramApi.getFollowButton();
                if (!elementHandle2)
                    throw new Error('Unfollow button did not change state');
            }
            await this.db.addPrevUnfollowedUser(res);
        }
        await core_1.Utils.sleep(1000);
        return res;
    }
    async getFollowersOrFollowing({ userId, getFollowers = false, maxFollowsPerUser, maxPages }) {
        const graphqlUrl = `${this.options.instagramBaseUrl}/graphql/query`;
        const followersUrl = `${graphqlUrl}/?query_hash=37479f2b8209594dde7facb0d904896a`;
        const followingUrl = `${graphqlUrl}/?query_hash=58712303d941c6855d4e888c5f0cd22f`;
        const graphqlVariables = {
            after: undefined,
            first: 50,
            id: userId,
        };
        const outUsers = [];
        let hasNextPage = true;
        let i = 0;
        const shouldProceed = () => {
            if (!hasNextPage) {
                return false;
            }
            const isBelowMaxPages = maxPages === null || maxPages === undefined || i < maxPages;
            const hasNotReachLimitPerUser = outUsers.length < maxFollowsPerUser + 5;
            if (getFollowers) {
                return isBelowMaxPages && hasNotReachLimitPerUser;
            }
            return isBelowMaxPages;
        };
        while (shouldProceed()) {
            const url = `${getFollowers ? followersUrl : followingUrl}&variables=${JSON.stringify(graphqlVariables)}`;
            await this.page.goto(url);
            const json = await this.getPageJson();
            const subPropName = getFollowers ? 'edge_followed_by' : 'edge_follow';
            const pageInfo = json.data.user[subPropName].page_info;
            const { edges } = json.data.user[subPropName];
            edges.forEach(e => outUsers.push(e.node.username));
            graphqlVariables.after = pageInfo.end_cursor;
            hasNextPage = pageInfo.has_next_page;
            i += 1;
            if (shouldProceed()) {
                this.logger.log(core_1.languageManager.messages.hasMorePages(i));
                await core_1.Utils.sleep(200);
            }
        }
        return outUsers;
    }
    async followUserFollowers(username, { maxFollowsPerUser = 5, skipPrivate = false, enableLikeImages, likeImagesMin, likeImagesMax, }) {
        this.logger.log(core_1.languageManager.messages.followingUpTo(maxFollowsPerUser, username));
        await this.throttle();
        let numFollowedForThisUser = 0;
        const userData = await this.navigateToUserAndGetData(username);
        let followers = await this.getFollowersOrFollowing({
            getFollowers: true,
            maxFollowsPerUser,
            userId: userData.id
        });
        this.logger.log('Followers', JSON.stringify(followers, null, 4));
        followers = await core_1.Utils.filter(followers, async (f) => !(await this.db.getPrevFollowedUser(f)));
        for (const follower of followers) {
            try {
                if (numFollowedForThisUser >= maxFollowsPerUser) {
                    this.logger.log(core_1.languageManager.messages.followingReachedLimit);
                    return;
                }
                const graphqlUser = await this.navigateToUserAndGetData(follower);
                const followedByCount = graphqlUser.edge_followed_by.count;
                const followsCount = graphqlUser.edge_follow.count;
                const isPrivate = graphqlUser.is_private;
                const ratio = followedByCount / (followsCount || 1);
                if (isPrivate && skipPrivate) {
                    this.logger.log(core_1.languageManager.messages.privateUser);
                }
                else if ((this.options.followUserMaxFollowers != null && followedByCount > this.options.followUserMaxFollowers) ||
                    (this.options.followUserMaxFollowing != null && followsCount > this.options.followUserMaxFollowing) ||
                    (this.options.followUserMinFollowers != null && followedByCount < this.options.followUserMinFollowers) ||
                    (this.options.followUserMinFollowing != null && followsCount < this.options.followUserMinFollowing)) {
                    this.logger.log(core_1.languageManager.messages.tooManyFollowerFollowing);
                }
                else if ((this.options.followUserRatioMax != null && ratio > this.options.followUserRatioMax) ||
                    (this.options.followUserRatioMin != null && ratio < this.options.followUserRatioMin)) {
                    this.logger.log(core_1.languageManager.messages.tooManyFollowerRation);
                }
                else {
                    await this.followCurrentUser(follower);
                    numFollowedForThisUser += 1;
                    await core_1.Utils.sleep(10000);
                    const hasReachedDailyLikesLimit = await this.hasReachedDailyLikesLimit();
                    if (!isPrivate && enableLikeImages && !hasReachedDailyLikesLimit) {
                        try {
                            await this.likeCurrentUserImages({ likeImagesMax, likeImagesMin, username: follower });
                        }
                        catch (err) {
                            this.logger.error(core_1.languageManager.messages.likeImageFailed(username), err);
                            await this.takeScreenshot();
                        }
                    }
                    await core_1.Utils.sleep(20000);
                    await this.throttle();
                }
            }
            catch (err) {
                this.logger.error(core_1.languageManager.messages.followingFailed(username), err);
                await core_1.Utils.sleep(20000);
            }
        }
    }
    async safelyUnfollowUserList(usersToUnfollow, limit) {
        this.logger.log(core_1.languageManager.messages.unfollowCount(usersToUnfollow.length));
        let i = 0;
        let j = 0;
        for (const username of usersToUnfollow) {
            try {
                const userFound = await this.navigateToUser(username);
                if (!userFound) {
                    await this.db.addPrevUnfollowedUser({ noActionTaken: true, time: new Date().getTime(), username });
                    await core_1.Utils.sleep(3000);
                }
                else {
                    const { noActionTaken } = await this.unfollowCurrentUser(username);
                    if (noActionTaken) {
                        await core_1.Utils.sleep(3000);
                    }
                    else {
                        await core_1.Utils.sleep(15000);
                        ++j;
                        if (j % 10 === 0) {
                            this.logger.log(core_1.languageManager.messages.unfollowBreak);
                            await core_1.Utils.sleep(10 * 60 * 1000, 0.1);
                        }
                    }
                }
                ++i;
                this.logger.log(core_1.languageManager.messages.unfollowCounter(i, usersToUnfollow.length));
                if (limit && j >= limit) {
                    this.logger.log(core_1.languageManager.messages.unfollowReachLimit(limit));
                    return;
                }
                await this.throttle();
            }
            catch (err) {
                this.logger.error(core_1.languageManager.messages.unfollowFailed, err);
            }
        }
    }
    async unfollowNonMutualFollowers({ limit } = {}) {
        this.logger.log(core_1.languageManager.messages.unfollowNonMutual);
        const userData = await this.navigateToUserAndGetData(this.options.username);
        const allFollowers = await this.getFollowersOrFollowing({
            getFollowers: true,
            userId: userData.id,
        });
        const allFollowing = await this.getFollowersOrFollowing({
            getFollowers: false,
            userId: userData.id,
        });
        const usersToUnfollow = await core_1.Utils.filter(allFollowing, async (u) => {
            if (allFollowers.includes(u))
                return false;
            if (this.options.excludeUsers.includes(u))
                return false;
            return !(await this.haveRecentlyFollowedUser(u));
        });
        this.logger.log(core_1.languageManager.messages.unfollowUsers, JSON.stringify(usersToUnfollow, null, 4));
        await this.safelyUnfollowUserList(usersToUnfollow, limit);
    }
    async unfollowAllUnknown({ limit } = {}) {
        this.logger.log('Unfollowing all except excludes and auto followed');
        const userData = await this.navigateToUserAndGetData(this.options.username);
        const allFollowing = await this.getFollowersOrFollowing({
            getFollowers: false,
            userId: userData.id,
        });
        const usersToUnfollow = await core_1.Utils.filter(allFollowing, async (u) => {
            const prevFollowedUser = this.db.getPrevFollowedUser(u);
            if (prevFollowedUser)
                return false;
            if (this.options.excludeUsers.includes(u))
                return false;
            return true;
        });
        this.logger.log(core_1.languageManager.messages.unfollowUsers, JSON.stringify(usersToUnfollow, null, 4));
        await this.safelyUnfollowUserList(usersToUnfollow, limit);
    }
    async unfollowOldFollowed({ ageInDays, limit } = {}) {
        (0, assert_1.default)(ageInDays);
        this.logger.log(core_1.languageManager.messages.unfollowOldAutofollow(ageInDays));
        const userData = await this.navigateToUserAndGetData(this.options.username);
        const allFollowing = await this.getFollowersOrFollowing({
            getFollowers: false,
            userId: userData.id,
        });
        const usersToUnfollow = (await core_1.Utils.filter(allFollowing, async (u) => {
            return await this.db.getPrevFollowedUser(u) &&
                !this.options.excludeUsers.includes(u) &&
                (new Date().getTime() - (await this.db.getPrevFollowedUser(u)).time) / (1000 * 60 * 60 * 24) > ageInDays;
        })).slice(0, limit);
        this.logger.log(core_1.languageManager.messages.unfollowUsers, JSON.stringify(usersToUnfollow, null, 4));
        await this.safelyUnfollowUserList(usersToUnfollow, limit);
        return usersToUnfollow.length;
    }
    async listManuallyFollowedUsers() {
        const userData = await this.navigateToUserAndGetData(this.options.username);
        const allFollowing = await this.getFollowersOrFollowing({
            getFollowers: false,
            userId: userData.id,
        });
        return core_1.Utils.filter(allFollowing, async (u) => {
            return !(await this.db.getPrevFollowedUser(u)) && !this.options.excludeUsers.includes(u);
        });
    }
    async initContext() {
        this.options = Object.assign(Object.assign({}, core_1.defaultBotOptions), this.options);
        this.logger = this.options.logger;
        core_1.Utils.logger = this.logger;
        (0, assert_1.default)(this.options.cookiesPath);
        (0, assert_1.default)(this.db);
        (0, assert_1.default)(this.options.maxFollowsPerHour * this.botWorkShiftHours >= this.options.maxFollowsPerDay, 'Max follows per hour too low compared to max follows per day');
        this.instagramApi = new core_1.InstagramApi(this.browser, this.logger);
        this.page = await this.instagramApi.startNewPage();
    }
    async takeScreenshot() {
        if (!this.options.screenshotOnError)
            return;
        try {
            const fileName = `${new Date().getTime()}.jpg`;
            this.logger.log(core_1.languageManager.messages.takingScreenshot, fileName);
            await this.page.screenshot({
                path: (0, path_1.join)(this.options.screenshotsPath, fileName),
                quality: 30,
                type: 'jpeg'
            });
        }
        catch (err) {
            this.logger.error(core_1.languageManager.messages.takingScreenshotFailed, err);
        }
    }
    async onImageLiked({ username, href }) {
        await this.db.addLikedPhoto({ href, time: new Date().getTime(), username });
    }
    async getNumFollowedUsersThisTimeUnit(timeUnit) {
        return (await this.db.getFollowedLastTimeUnit(timeUnit)).length
            + (await this.db.getUnfollowedLastTimeUnit(timeUnit)).length;
    }
    async checkReachedFollowedUserDayLimit() {
        const reachedFollowedUserDayLimit = (await this.getNumFollowedUsersThisTimeUnit(this.dayMs)) >= this.options.maxFollowsPerDay;
        if (reachedFollowedUserDayLimit) {
            this.logger.log(core_1.languageManager.messages.reachDailyFollowUnfollowLimit);
            await core_1.Utils.sleep(10 * 60 * 1000);
        }
    }
    async checkReachedFollowedUserHourLimit() {
        const hasReachedFollowedUserHourLimit = (await this.getNumFollowedUsersThisTimeUnit(this.hourMs)) >= this.options.maxFollowsPerHour;
        if (hasReachedFollowedUserHourLimit) {
            this.logger.log(core_1.languageManager.messages.reachHourlyFollowLimit);
            await core_1.Utils.sleep(10 * 60 * 1000);
        }
    }
    async throttle() {
        await this.checkReachedFollowedUserDayLimit();
        await this.checkReachedFollowedUserHourLimit();
    }
    async hasReachedDailyLikesLimit() {
        return (await this.db.getLikedPhotosLastTimeUnit(this.dayMs)).length >= this.options.maxLikesPerDay;
    }
    async haveRecentlyFollowedUser(username) {
        const followedUserEntry = await this.db.getPrevFollowedUser(username);
        if (!followedUserEntry)
            return false;
        return new Date().getTime() - followedUserEntry.time < this.options.dontUnfollowUntilTimeElapsed;
    }
    async safeGoto(url, isRetrying = false) {
        this.logger.log(core_1.languageManager.messages.goToUrl(url));
        const response = await this.page.goto(url);
        await core_1.Utils.sleep(1000);
        const status = response.status();
        if (status === 200) {
            return true;
        }
        else if (status === 404) {
            this.logger.log(core_1.languageManager.messages.userNotFound);
            return false;
        }
        else if (status === 429) {
            this.logger.error(core_1.languageManager.messages.tooManyRequests);
            await core_1.Utils.sleep(60 * 60 * 1000);
            if (!isRetrying) {
                await this.safeGoto(url, true);
            }
        }
        throw new Error(`Navigate to user returned status ${response.status()}`);
    }
    async navigateToUser(username) {
        this.logger.log(core_1.languageManager.messages.navigatingToUser(username));
        return this.safeGoto(`${this.options.instagramBaseUrl}/${encodeURIComponent(username)}`);
    }
    async getPageJson() {
        const jsonValue = await (await (await this.page.$('pre')).getProperty('textContent')).jsonValue();
        return JSON.parse(jsonValue);
    }
    async navigateToUserAndGetData(username) {
        if (this.graphqlUserMissing) {
            const found = await this.safeGoto(`${this.options.instagramBaseUrl}/${encodeURIComponent(username)}?__a=1`);
            if (!found)
                throw new Error('User not found');
            const json = await this.getPageJson();
            const { user } = json.graphql;
            await this.navigateToUser(username);
            return user;
        }
        await this.navigateToUser(username);
        const sharedData = await this.page.evaluate(() => window._sharedData);
        try {
            return sharedData.entry_data.ProfilePage[0].graphql.user;
        }
        catch (err) {
            this.logger.warn(core_1.languageManager.messages.missingGraphql);
            this.graphqlUserMissing = true;
            return this.navigateToUserAndGetData(username);
        }
    }
    async checkActionBlocked() {
        if (await this.instagramApi.isActionBlocked()) {
            this.logger.error(core_1.languageManager.messages.actionBlocked);
            await this.tryDeleteCookies();
            const errorMsg = core_1.languageManager.messages.actionBlockedAbortion;
            this.logger.error(errorMsg);
            throw new Error(errorMsg);
        }
    }
    async likeCurrentUserImagesPageCode({ dryRun: dryRunIn, likeImagesMin, likeImagesMax }) {
        const allImages = Array.from(document.getElementsByTagName('a')).filter(el => /instagram.com\/p\//.test(el.href));
        function shuffleArray(arrayIn) {
            const array = [...arrayIn];
            for (let i = array.length - 1; i > 0; i -= 1) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        const imagesShuffled = shuffleArray(allImages);
        const numImagesToLike = Math.floor((Math.random() * ((likeImagesMax + 1) - likeImagesMin)) + likeImagesMin);
        window.instautoLog(core_1.languageManager.messages.likeImageCount(numImagesToLike));
        const images = imagesShuffled.slice(0, numImagesToLike);
        if (images.length < 1) {
            window.instautoLog(core_1.languageManager.messages.noImageToLike);
            return;
        }
        for (const image of images) {
            image.click();
            await window.instautoSleep(3000);
            const dialog = document.querySelector('*[role=dialog]');
            if (!dialog)
                throw new Error('Dialog not found');
            const section = Array.from(dialog.querySelectorAll('section')).find(s => s.querySelectorAll('*[aria-label="Like"]')[0] && s.querySelectorAll('*[aria-label="Comment"]')[0]);
            if (!section)
                throw new Error('Like button section not found');
            const likeButtonChild = section.querySelectorAll('*[aria-label="Like"]')[0];
            if (!likeButtonChild)
                throw new Error('Like button not found (aria-label)');
            function findClickableParent(el) {
                let elAt = el;
                while (elAt) {
                    if (elAt.click) {
                        return elAt;
                    }
                    elAt = elAt.parentElement;
                }
                return undefined;
            }
            const foundClickable = findClickableParent(likeButtonChild);
            if (!foundClickable)
                throw new Error('Like button not found');
            if (!dryRunIn) {
                foundClickable.click();
                window.instautoOnImageLiked(image.href);
            }
            await window.instautoSleep(3000);
            const closeButtonChild = document.querySelector('button [aria-label=Close]');
            if (!closeButtonChild)
                throw new Error('Close button not found (aria-label)');
            const closeButton = findClickableParent(closeButtonChild);
            if (!closeButton)
                throw new Error('Close button not found');
            closeButton.click();
            await window.instautoSleep(5000);
        }
        window.instautoLog(core_1.languageManager.messages.likeImageDone);
    }
    async likeCurrentUserImages({ username, likeImagesMin, likeImagesMax }) {
        if (!likeImagesMin || !likeImagesMax || likeImagesMax < likeImagesMin || likeImagesMin < 1)
            throw new Error('Invalid arguments');
        this.logger.log(core_1.languageManager.messages.likeImageCount(`${likeImagesMin}-${likeImagesMax}`));
        try {
            await this.page.exposeFunction('instautoSleep', core_1.Utils.sleep);
            await this.page.exposeFunction('instautoLog', (...args) => console.log(...args));
            await this.page.exposeFunction('instautoOnImageLiked', (href) => this.onImageLiked({ href, username }));
        }
        catch (err) {
        }
        await this.page.evaluate(this.likeCurrentUserImagesPageCode, {
            dryRun: this.options.dryRun,
            likeImagesMax,
            likeImagesMin
        });
    }
}
exports.InstautoCtr = InstautoCtr;
const Instauto = async (db, browser, options) => {
    const instance = new InstautoCtr(db, browser, options);
    await instance.setup();
    return instance;
};
exports.Instauto = Instauto;
//# sourceMappingURL=bot.js.map