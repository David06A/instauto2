"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramApi = void 0;
const utils_1 = require("./utils");
const ActionBlocked = Symbol('ActionBlocked');
const TryAgainLater = Symbol('TryAgainLater');
const Follow = Symbol('Follow');
const FollowBack = Symbol('FollowBack');
const Following = Symbol('Following');
const Requested = Symbol('Requested');
const AriaLabelFollowing = Symbol('AriaLabelFollowing');
const Unfollow = Symbol('Unfollow');
const IsLoggedIn = Symbol('IsLoggedIn');
const AcceptCookies = Symbol('AcceptCookies');
const LogInMobile = Symbol('LogInMobile');
const LogIn = Symbol('LogIn');
const SaveLoginInfo = Symbol('SaveLoginInfo');
const NotificationDialogNotNow = Symbol('NotificationDialogNotNow');
const AuthSwitcher = Symbol('AuthSwitcher');
const pageContent = new Map([
    [ActionBlocked, '//*[contains(text(), "Action Blocked")]'],
    [TryAgainLater, '//*[contains(text(), "Try Again Later")]'],
    [Follow, "//header//button[text()='Follow']"],
    [FollowBack, "//header//button[text()='Follow Back']"],
    [Following, "//header//button[text()='Following']"],
    [Requested, "//header//button[text()='Requested']"],
    [AriaLabelFollowing, "//header//button[*//span[@aria-label='Following']]"],
    [Unfollow, "//button[text()='Unfollow']"],
    [IsLoggedIn, '//*[@aria-label="Home"]'],
    [AcceptCookies, '//button[contains(text(), "Allow all cookies")]'],
    [LogIn, "//button[.//div[contains(., 'Log in')]]"],
    [LogInMobile, '//button[contains(text(), "Log In")]'],
    [SaveLoginInfo, '//button[contains(text(), "Save Info")]'],
    [NotificationDialogNotNow, '//button[contains(text(), "Not Now")]'],
    [AuthSwitcher, 'a[href="/accounts/login/?source=auth_switcher"]'],
]);
class InstagramApi {
    constructor(browser, logger) {
        this.browser = browser;
        this.logger = logger;
        utils_1.Utils.logger = logger;
    }
    async startNewPage() {
        const page = await this.browser.newPage();
        this.page = utils_1.Utils.puppeteerPageOverride(page);
        return this.page;
    }
    async isActionBlocked() {
        if (!this.page) {
            throw new Error('Page is not set yet.');
        }
        const actionBlocked = (await this.page.$x(pageContent.get(ActionBlocked))).length > 0;
        const tryAgainLater = (await this.page.$x(pageContent.get(TryAgainLater))).length > 0;
        return actionBlocked || tryAgainLater;
    }
    async getFollowButton() {
        const elementHandles = await this.page.$x(pageContent.get(Follow));
        if (elementHandles.length > 0)
            return elementHandles[0];
        const elementHandles2 = await this.page.$x(pageContent.get(FollowBack));
        if (elementHandles2.length > 0)
            return elementHandles2[0];
    }
    async getUnfollowButton() {
        const elementHandles = await this.page.$x(pageContent.get(Following));
        if (elementHandles.length > 0)
            return elementHandles[0];
        const elementHandles2 = await this.page.$x(pageContent.get(Requested));
        if (elementHandles2.length > 0)
            return elementHandles2[0];
        const elementHandles3 = await this.page.$x(pageContent.get(AriaLabelFollowing));
        if (elementHandles3.length > 0)
            return elementHandles3[0];
        return undefined;
    }
    async getUnfollowConfirmButton() {
        const elementHandles = await this.page.$x(pageContent.get(Unfollow));
        return elementHandles[0];
    }
    async isLoggedIn() {
        return (await this.page.$x(pageContent.get(IsLoggedIn))).length === 1;
    }
    async tryPressAcceptCookies() {
        const element = await this.page.$x(pageContent.get(AcceptCookies));
        return this.tryPressButton(element, 'Accept cookies dialog');
    }
    async tryPressSaveLogInInfo() {
        const element = await this.page.$x(pageContent.get(SaveLoginInfo));
        return this.tryPressButton(element, 'Save login info dialog');
    }
    async tryPressNotNowNotificationDialog() {
        const element = await this.page.$x(pageContent.get(NotificationDialogNotNow));
        return this.tryPressButton(element, 'Turn on Notifications dialog');
    }
    async tryPressAuthSwitcher() {
        const element = await this.page.$x(pageContent.get(AuthSwitcher));
        return this.tryPressButton(element, 'Try to press auth switcher');
    }
    async tryToLogin(username, password) {
        this.logger.log(`entering username`);
        await this.page.type('input[name="username"]', username, { delay: 50 });
        await utils_1.Utils.sleep(1000);
        this.logger.log(`entering password`);
        await this.page.type('input[name="password"]', password, { delay: 50 });
        await utils_1.Utils.sleep(1000);
        this.logger.log(`pressing login button`);
        await this.tryPressLogIn();
        await utils_1.Utils.sleep(6000);
    }
    async tryPressLogIn() {
        this.logger.log(`Pressing button: Log In`);
        const element = await this.page.$x(pageContent.get(LogIn));
        await this.tryPressButton(element, 'Login form button');
    }
    async tryPressButton(elementHandles, name) {
        try {
            if (elementHandles.length === 1) {
                this.logger.log(`Pressing button: ${name}`);
                elementHandles[0].click();
                await utils_1.Utils.sleep(3000);
            }
            else {
                this.logger.warn(`Button not found: ${name}`);
            }
        }
        catch (err) {
            this.logger.warn(`Failed to press button: ${name}`);
        }
    }
}
exports.InstagramApi = InstagramApi;
//# sourceMappingURL=instagram-api.js.map