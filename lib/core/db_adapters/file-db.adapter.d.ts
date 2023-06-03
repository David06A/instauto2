import { AbstractDbAdapter } from './index';
import { Follower, LikedPhoto, LiteLogger, UnFollower } from '../interfaces';
export declare type FileDbOptions = {
    followedDbPath: string;
    unfollowedDbPath: string;
    likedPhotosDbPath: string;
    logger: LiteLogger;
};
export declare class FileDbAdapter extends AbstractDbAdapter {
    protected readonly logger: LiteLogger;
    private prevFollowedUsers;
    private prevUnfollowedUsers;
    private prevLikedPhotos;
    private readonly followedDbPath;
    private readonly unfollowedDbPath;
    private readonly likedPhotosDbPath;
    private _loadingIsComplete;
    private _loadingPromise;
    constructor({ followedDbPath, unfollowedDbPath, likedPhotosDbPath, logger }?: FileDbOptions);
    addLikedPhoto({ username, href, time }: LikedPhoto): Promise<void>;
    addPrevFollowedUser(follower: Follower): Promise<void>;
    addPrevUnfollowedUser(unfollower: UnFollower): Promise<void>;
    getFollowedLastTimeUnit(timeUnit: number): Promise<Follower[]>;
    getLikedPhotosLastTimeUnit(timeUnit: number): Promise<LikedPhoto[]>;
    getPrevFollowedUser(username: string): Promise<Follower>;
    getUnfollowedLastTimeUnit(timeUnit: number): Promise<UnFollower[]>;
    private getPrevLikedPhotos;
    private getPrevUnfollowedUsers;
    private getPrevFollowedUsers;
    private tryLoadDb;
    private trySaveDb;
    private awaitLoadingIfNecessary;
}
