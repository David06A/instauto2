import { Page } from 'puppeteer-core';
import { Logger } from './interfaces';
export declare class Utils {
    private static _logger;
    static set logger(logger: Logger);
    static puppeteerPageOverride(page: Page): Page;
    static keyBy<T>(collection: T[], key: string): Record<string, T>;
    static sleep(ms: number, dev?: number): Promise<string>;
    static filter<T>(arr: T[], predicate: (element: T) => Promise<boolean>): Promise<T[]>;
}
