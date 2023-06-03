"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LokiDbAdapter = void 0;
const abstract_db_adapter_1 = require("./abstract-db.adapter");
class LokiDbAdapter extends abstract_db_adapter_1.AbstractDbAdapter {
    constructor(instance, logger = console) {
        super();
        this.instance = instance;
        this.logger = logger;
        this.collectionNames = {
            followed: 'followed',
            'liked-photos': 'liked-photos',
            unfollowed: 'unfollowed'
        };
        this.createCollectionsIfNecessary();
    }
    addLikedPhoto({ username, href, time }) {
        const collection = this.instance.getCollection(this.collectionNames['liked-photos']);
        return collection.insert({ href, time, username });
    }
    addPrevFollowedUser(follower) {
        const collection = this.instance.getCollection(this.collectionNames.followed);
        return collection.insert(follower);
    }
    addPrevUnfollowedUser(unfollower) {
        const collection = this.instance.getCollection(this.collectionNames.unfollowed);
        return collection.insert(unfollower);
    }
    getFollowedLastTimeUnit(timeUnit) {
        const now = new Date().getTime();
        const collection = this.instance.getCollection(this.collectionNames.followed);
        const constraint = now - timeUnit;
        return Promise.resolve(collection.find({ time: { '$gte': constraint } }));
    }
    getLikedPhotosLastTimeUnit(timeUnit) {
        const now = new Date().getTime();
        const collection = this.instance.getCollection(this.collectionNames['liked-photos']);
        const constraint = now - timeUnit;
        return Promise.resolve(collection.find({ time: { '$gte': constraint } }));
    }
    getPrevFollowedUser(username) {
        const collection = this.instance.getCollection(this.collectionNames.followed);
        return Promise.resolve(collection.findOne({ username }));
    }
    getUnfollowedLastTimeUnit(timeUnit) {
        const now = new Date().getTime();
        const collection = this.instance.getCollection(this.collectionNames.unfollowed);
        const constraint = now - timeUnit;
        return Promise.resolve(collection.find({ time: { '$gte': constraint } }));
    }
    createCollectionsIfNecessary() {
        let shouldSaveDatabase = false;
        for (const collectionName of Object.keys(this.collectionNames)) {
            if (!this.instance.getCollection(collectionName)) {
                this.instance.addCollection(collectionName, { disableMeta: true });
                shouldSaveDatabase = true;
            }
        }
        if (shouldSaveDatabase) {
            this.instance.saveDatabase();
        }
    }
}
exports.LokiDbAdapter = LokiDbAdapter;
//# sourceMappingURL=loki-db.adapter.js.map