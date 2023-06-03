"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const language_manager_1 = require("./lang/language-manager");
class Utils {
    static set logger(logger) {
        this._logger = logger;
    }
    static puppeteerPageOverride(page) {
        const originalXPath = page.$x;
        page.$x = async function (expression) {
            const containsSensitiveRegexp = new RegExp(/\[contains\(text\(\), (.*)\)\]/);
            const alphabetLo = 'abcdefghijklmnopqrstuvwxyz';
            const alphabetUp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            expression = expression.replace(containsSensitiveRegexp, (match, p1) => {
                return `[contains(translate(text(), '${alphabetUp}', '${alphabetLo}'), ${p1.toLowerCase()})]`;
            });
            return originalXPath.apply(this, [expression]);
        };
        return page;
    }
    static keyBy(collection, key) {
        const result = {};
        collection.reduce((accumulator, current) => {
            accumulator[current[key]] = current;
            return accumulator;
        }, result);
        return result;
    }
    static sleep(ms, dev = 1) {
        const msWithDev = ((Math.random() * dev) + 1) * ms;
        this._logger.log(language_manager_1.languageManager.messages.waiting, Math.round(msWithDev / 1000), 'sec');
        return new Promise(resolve => setTimeout(resolve, msWithDev));
    }
    static async filter(arr, predicate) {
        const results = await Promise.all(arr.map(predicate));
        return arr.filter((_v, index) => results[index]);
    }
}
exports.Utils = Utils;
Utils._logger = console;
//# sourceMappingURL=utils.js.map