"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDbAdapter = void 0;
const promises_1 = require("fs/promises");
const index_1 = require("./index");
const utils_1 = require("../utils");
const __1 = require("..");
class FileDbAdapter extends index_1.AbstractDbAdapter {
    constructor({ followedDbPath, unfollowedDbPath, likedPhotosDbPath, logger } = {
        followedDbPath: null,
        likedPhotosDbPath: null,
        logger: console,
        unfollowedDbPath: null
    }) {
        super();
        this.prevFollowedUsers = {};
        this.prevUnfollowedUsers = {};
        this.prevLikedPhotos = [];
        this._loadingIsComplete = false;
        this.followedDbPath = followedDbPath;
        this.unfollowedDbPath = unfollowedDbPath;
        this.likedPhotosDbPath = likedPhotosDbPath;
        this.logger = logger;
        if (!this.logger) {
            this.logger = console;
        }
        this._loadingPromise = this.tryLoadDb().finally(() => {
            this._loadingIsComplete = true;
        });
    }
    async addLikedPhoto({ username, href, time }) {
        this.prevLikedPhotos.push({ href, time, username });
        await this.awaitLoadingIfNecessary();
        await this.trySaveDb();
    }
    async addPrevFollowedUser(follower) {
        this.prevFollowedUsers[follower.username] = follower;
        await this.awaitLoadingIfNecessary();
        await this.trySaveDb();
    }
    async addPrevUnfollowedUser(unfollower) {
        this.prevUnfollowedUsers[unfollower.username] = unfollower;
        await this.awaitLoadingIfNecessary();
        await this.trySaveDb();
    }
    async getFollowedLastTimeUnit(timeUnit) {
        const now = new Date().getTime();
        return (await this.getPrevFollowedUsers())
            .filter(u => now - u.time < timeUnit);
    }
    async getLikedPhotosLastTimeUnit(timeUnit) {
        const now = new Date().getTime();
        return (await this.getPrevLikedPhotos())
            .filter(u => now - u.time < timeUnit);
    }
    async getPrevFollowedUser(username) {
        return this.prevFollowedUsers[username];
    }
    async getUnfollowedLastTimeUnit(timeUnit) {
        const now = new Date().getTime();
        return (await this.getPrevUnfollowedUsers())
            .filter(u => now - u.time < timeUnit);
    }
    async getPrevLikedPhotos() {
        return this.prevLikedPhotos;
    }
    async getPrevUnfollowedUsers() {
        return Object.values(this.prevUnfollowedUsers);
    }
    async getPrevFollowedUsers() {
        return Object.values(this.prevFollowedUsers);
    }
    async tryLoadDb() {
        try {
            this.prevFollowedUsers = utils_1.Utils.keyBy(JSON.parse((await (0, promises_1.readFile)(this.followedDbPath)).toString()), 'username');
        }
        catch (err) {
            this.logger.warn(__1.languageManager.messages.dbNoFollowedDatabase);
        }
        try {
            this.prevUnfollowedUsers = utils_1.Utils.keyBy(JSON.parse((await (0, promises_1.readFile)(this.unfollowedDbPath)).toString()), 'username');
        }
        catch (err) {
            this.logger.warn(__1.languageManager.messages.dbNoUnfollowedDatabase);
        }
        try {
            this.prevLikedPhotos = JSON.parse((await (0, promises_1.readFile)(this.likedPhotosDbPath)).toString());
        }
        catch (err) {
            this.logger.warn(__1.languageManager.messages.dbNoLikesDatabase);
        }
    }
    async trySaveDb() {
        try {
            await (0, promises_1.writeFile)(this.followedDbPath, JSON.stringify(Object.values(this.prevFollowedUsers)));
            await (0, promises_1.writeFile)(this.unfollowedDbPath, JSON.stringify(Object.values(this.prevUnfollowedUsers)));
            await (0, promises_1.writeFile)(this.likedPhotosDbPath, JSON.stringify(this.prevLikedPhotos));
        }
        catch (err) {
            this.logger.error(__1.languageManager.messages.dbSaveFailed);
        }
    }
    async awaitLoadingIfNecessary() {
        if (!this._loadingIsComplete) {
            return await this._loadingPromise;
        }
        return;
    }
}
exports.FileDbAdapter = FileDbAdapter;
//# sourceMappingURL=file-db.adapter.js.map