"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageManager = exports.Instauto = void 0;
var bot_1 = require("./bot");
Object.defineProperty(exports, "Instauto", { enumerable: true, get: function () { return bot_1.Instauto; } });
__exportStar(require("./core/db_adapters"), exports);
var core_1 = require("./core");
Object.defineProperty(exports, "languageManager", { enumerable: true, get: function () { return core_1.languageManager; } });
//# sourceMappingURL=index.js.map