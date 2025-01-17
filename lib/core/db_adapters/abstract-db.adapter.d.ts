import { IDbAdapter } from './interfaces';
import { Follower, UnFollower, LikedPhoto, LiteLogger } from '../interfaces';
export declare abstract class AbstractDbAdapter implements IDbAdapter {
    protected abstract readonly logger: LiteLogger;
    abstract addLikedPhoto({ username, href, time }: LikedPhoto): Promise<void>;
    abstract addPrevFollowedUser(follower: Follower): Promise<void>;
    abstract addPrevUnfollowedUser(unfollower: UnFollower): Promise<void>;
    abstract getFollowedLastTimeUnit(timeUnit: number): Promise<Follower[]>;
    abstract getLikedPhotosLastTimeUnit(timeUnit: number): Promise<LikedPhoto[]>;
    abstract getPrevFollowedUser(username: string): Promise<Follower>;
    abstract getUnfollowedLastTimeUnit(timeUnit: number): Promise<UnFollower[]>;
}
