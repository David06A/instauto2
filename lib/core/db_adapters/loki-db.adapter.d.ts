import { AbstractDbAdapter } from './abstract-db.adapter';
import { Follower, LikedPhoto, LiteLogger, UnFollower } from '../interfaces';
interface TLikeLokiCollection<T = any> {
    insert: (data: T) => T;
    find: (query?: unknown) => (T & any)[];
    findOne: (query?: unknown) => (T & any);
}
interface TLoki {
    getCollection: (string: any) => TLikeLokiCollection;
    addCollection: (name: string, options?: Record<string, any>) => TLikeLokiCollection;
    saveDatabase: (callback?: (err?: any) => void) => void;
}
export declare class LokiDbAdapter<T extends TLoki> extends AbstractDbAdapter {
    private readonly instance;
    protected readonly logger: LiteLogger;
    private readonly collectionNames;
    constructor(instance: T, logger?: LiteLogger);
    addLikedPhoto({ username, href, time }: LikedPhoto): Promise<void>;
    addPrevFollowedUser(follower: Follower): Promise<void>;
    addPrevUnfollowedUser(unfollower: UnFollower): Promise<void>;
    getFollowedLastTimeUnit(timeUnit: number): Promise<Follower[]>;
    getLikedPhotosLastTimeUnit(timeUnit: number): Promise<LikedPhoto[]>;
    getPrevFollowedUser(username: string): Promise<Follower>;
    getUnfollowedLastTimeUnit(timeUnit: number): Promise<UnFollower[]>;
    private createCollectionsIfNecessary;
}
export {};
