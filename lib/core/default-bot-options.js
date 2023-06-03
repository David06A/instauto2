"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultBotOptions = void 0;
exports.defaultBotOptions = {
    dontUnfollowUntilTimeElapsed: 3 * 24 * 60 * 60 * 1000,
    dryRun: true,
    enableCookies: true,
    excludeUsers: [],
    followUserMaxFollowers: null,
    followUserMaxFollowing: null,
    followUserMinFollowers: null,
    followUserMinFollowing: null,
    followUserRatioMax: 4.0,
    followUserRatioMin: 0.2,
    instagramBaseUrl: 'https://www.instagram.com',
    logger: console,
    maxFollowsPerDay: 150,
    maxFollowsPerHour: 20,
    maxLikesPerDay: 50,
    randomizeUserAgent: true,
    screenshotOnError: false,
    screenshotsPath: '.'
};
//# sourceMappingURL=default-bot-options.js.map