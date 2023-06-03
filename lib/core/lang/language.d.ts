export interface Messages {
    dbNoFollowedDatabase: 'No followed database found' | string;
    dbNoUnfollowedDatabase: 'No unfollowed database found' | string;
    dbNoLikesDatabase: 'No likes database found' | string;
    dbSaveFailed: 'Failed to save database' | string;
    settingInstagramLanguage: 'Setting language to english' | string;
    logginPageButtonNotFound: 'Login page button not found, assuming we have login form' | string;
    stillNotLoggedIn: 'Still not logged in, trying to reload loading page' | string;
    loginFailed: 'WARNING: Login has not succeeded. This could be because of an incorrect username/password, or a "suspicious login attempt"-message. You need to manually complete the process.' | string;
    haveFollowedInTheLastDay: (value: string | number) => `Have followed/unfollowed ... in the last 24 hours` | string;
    haveFollowedInTheLastHour: (value: string | number) => `Have followed/unfollowed ... in the last hour` | string;
    haveLikedImagesInTheLastDay: (value: string | number) => `Have liked ... images in the last 24 hours` | string;
    usernameDetectionFailed: 'Failed to detect username' | string;
    noCookiesFound: 'No cookies found' | string;
    savingCookies: 'Saving cookies' | string;
    savingCookiesFailed: 'Failed to save the cookies' | string;
    deletingCookies: 'Deleting cookies' | string;
    deletingCookiesFailed: 'Failed to delete the cookies' | string;
    alreadyFollowingUser: 'We are already following this user' | string;
    followingUser: (value: string) => `Following user ...` | string;
    buttonStateUnchanged: 'Button did not change state' | string;
    unfollowingUser: (value: string) => `Unfollowing user ...` | string;
    alreadyUnfollowUser: 'User has been unfollowed already' | string;
    unfollowingUserFailed: 'Failed to find unfollow button' | string;
    hasMorePages: (value: string | number) => `Has more pages (current ...)` | string;
    followingUpTo: (value: string | number, username: string) => `Following up to ... followers of ...` | string;
    followingReachedLimit: 'Have reached followed limit for this user, stopping' | string;
    privateUser: `User is private, skipping` | string;
    tooManyFollowerFollowing: (followedByCount: number, followsCount: number) => 'User has too many or too few followers or following, skipping. followedByCount: ... followsCount: ...' | string;
    tooManyFollowerRation: 'User has too many followers compared to follows or opposite, skipping' | string;
    likeImageFailed: (value: string) => `Failed to follow user images ...` | string;
    followingFailed: (value: string) => `Failed to process follower ...` | string;
    unfollowCount: (count: number) => `Unfollowing ... users` | string;
    unfollowBreak: 'Have unfollowed 10 users since last break. Taking a break' | string;
    unfollowCounter: (value: number, total: number) => `Have now unfollowed ... users of total ...` | string;
    unfollowReachLimit: (limit: number) => `Have unfollowed limit of ..., stopping` | string;
    unfollowFailed: 'Failed to unfollow, continuing with next' | string;
    unfollowNonMutual: 'Unfollowing non-mutual followers...' | string;
    unfollowUsers: 'Users to unfollow' | string;
    unfollowOldAutofollow: (days: number) => `Unfollowing currently followed users who were auto-followed more than ... days ago...` | string;
    takingScreenshot: 'Taking screenshot' | string;
    takingScreenshotFailed: 'Failed to take screenshot' | string;
    reachDailyFollowUnfollowLimit: 'Have reached daily follow/unfollow limit, waiting 10 min' | string;
    reachHourlyFollowLimit: 'Have reached hourly follow rate limit, waiting 10 min' | string;
    goToUrl: (url: string) => 'Go to ...' | string;
    userNotFound: 'User not found' | string;
    tooManyRequests: 'Got 429 Too Many Requests, waiting...' | string;
    navigatingToUser: (username: string) => `Navigating to user ...` | string;
    missingGraphql: 'Missing graphql in page, falling back to alternative method...' | string;
    actionBlocked: `Action Blocked` | string;
    actionBlockedAbortion: 'Aborted operation due to action blocked' | string;
    likeImageCount: (count: number | string) => `Liking ... image(s)` | string;
    noImageToLike: 'No images to like' | string;
    likeImageDone: 'Done liking images' | string;
    waiting: 'Waiting' | string;
}
export interface Language {
    fr: Messages;
    en: Messages;
}
export declare const LanguageMessages: Language;
