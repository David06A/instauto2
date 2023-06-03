"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageManager = void 0;
const language_1 = require("./language");
class LanguageManager {
    constructor() {
        this._languageMessages = language_1.LanguageMessages.en;
    }
    get messages() {
        return this._languageMessages;
    }
    useExistingCustomLanguage(key) {
        this._languageMessages = language_1.LanguageMessages[key];
    }
    setCustomLanguage(LanguageMessages) {
        this._languageMessages = LanguageMessages;
    }
    resetLanguage() {
        this._languageMessages = language_1.LanguageMessages.en;
    }
}
exports.languageManager = new LanguageManager();
//# sourceMappingURL=language-manager.js.map