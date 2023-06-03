import { Messages } from './language';
declare class LanguageManager {
    private _languageMessages;
    get messages(): Messages;
    useExistingCustomLanguage(key: 'fr' | 'en'): void;
    setCustomLanguage(LanguageMessages: Messages): void;
    resetLanguage(): void;
}
export declare const languageManager: LanguageManager;
export {};
