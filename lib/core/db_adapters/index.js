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
exports.LokiDbAdapter = exports.FileDbAdapter = exports.AbstractDbAdapter = void 0;
var abstract_db_adapter_1 = require("./abstract-db.adapter");
Object.defineProperty(exports, "AbstractDbAdapter", { enumerable: true, get: function () { return abstract_db_adapter_1.AbstractDbAdapter; } });
var file_db_adapter_1 = require("./file-db.adapter");
Object.defineProperty(exports, "FileDbAdapter", { enumerable: true, get: function () { return file_db_adapter_1.FileDbAdapter; } });
var loki_db_adapter_1 = require("./loki-db.adapter");
Object.defineProperty(exports, "LokiDbAdapter", { enumerable: true, get: function () { return loki_db_adapter_1.LokiDbAdapter; } });
__exportStar(require("./interfaces"), exports);
//# sourceMappingURL=index.js.map