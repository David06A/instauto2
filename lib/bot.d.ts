import { Browser, Page } from 'puppeteer-core';
import { AbstractDbAdapter, BotOptions, UnFollower } from './core';
export declare class InstautoCtr {
    private readonly db;
    private readonly browser;
    private page;
    private options;
    private botWorkShiftHours;
    private dayMs;
    private hourMs;
    private graphqlUserMissing;
    private instagramApi;
    private logger;
    constructor(db: AbstractDbAdapter, browser: Browser, page: Page, options: BotOptions);
    get sleep(): (ms: number, dev?: number) => Promise<string>;
    setup(): Promise<void>;
    tryLoadCookies(): Promise<void>;
    trySaveCookies(): Promise<void>;
    tryDeleteCookies(): Promise<void>;
    followUsersFollowers({ usersToFollowFollowersOf, maxFollowsTotal, skipPrivate, enableLikeImages, likeImagesMin, likeImagesMax, }: {
        usersToFollowFollowersOf: any;
        maxFollowsTotal?: number;
        skipPrivate: any;
        enableLikeImages?: boolean;
        likeImagesMin?: number;
        likeImagesMax?: number;
    }): Promise<void>;
    followCurrentUser(username: string): Promise<void>;
    unfollowCurrentUser(username: string): Promise<UnFollower>;
    getFollowersOrFollowing({ userId, getFollowers, maxFollowsPerUser, maxPages, }: {
        userId: number;
        getFollowers: boolean;
        maxFollowsPerUser?: number;
        maxPages?: number;
    }): Promise<string[]>;
    followUserFollowers(username: string, { maxFollowsPerUser, skipPrivate, enableLikeImages, likeImagesMin, likeImagesMax, }: {
        maxFollowsPerUser?: number;
        skipPrivate?: boolean;
        enableLikeImages: boolean;
        likeImagesMin: number;
        likeImagesMax: number;
    }): Promise<void>;
    safelyUnfollowUserList(usersToUnfollow: string[], limit: number): Promise<void>;
    unfollowNonMutualFollowers({ limit, }?: {
        limit?: number;
    }): Promise<void>;
    unfollowAllUnknown({ limit, }?: {
        limit?: number;
    }): Promise<void>;
    unfollowOldFollowed({ ageInDays, limit, }?: {
        ageInDays?: number;
        limit?: number;
    }): Promise<number>;
    listManuallyFollowedUsers(): Promise<string[]>;
    private initContext;
    private takeScreenshot;
    private onImageLiked;
    private getNumFollowedUsersThisTimeUnit;
    private checkReachedFollowedUserDayLimit;
    private checkReachedFollowedUserHourLimit;
    private throttle;
    private hasReachedDailyLikesLimit;
    private haveRecentlyFollowedUser;
    private safeGoto;
    private navigateToUser;
    private getPageJson;
    private navigateToUserAndGetData;
    private checkActionBlocked;
    private likeCurrentUserImagesPageCode;
    private likeCurrentUserImages;
}
export declare const Instauto: (db: AbstractDbAdapter, browser: Browser, page: Page | undefined, options: BotOptions) => Promise<InstautoCtr>;
