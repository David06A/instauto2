import { Browser, ElementHandle, Page } from 'puppeteer-core';
import { Logger } from './interfaces';
export declare class InstagramApi {
    private readonly browser;
    private readonly logger;
    private page;
    constructor(browser: Browser, logger: Logger);
    startNewPage(overridePage: Page | undefined): Promise<Page>;
    isActionBlocked(): Promise<boolean>;
    getFollowButton(): Promise<ElementHandle>;
    getUnfollowButton(): Promise<ElementHandle>;
    getUnfollowConfirmButton(): Promise<ElementHandle>;
    isLoggedIn(): Promise<boolean>;
    tryPressAcceptCookies(): Promise<void>;
    tryPressSaveLogInInfo(): Promise<void>;
    tryPressNotNowNotificationDialog(): Promise<void>;
    tryPressAuthSwitcher(): Promise<void>;
    tryToLogin(username: string, password: string): Promise<void>;
    private tryPressLogIn;
    private tryPressButton;
}
