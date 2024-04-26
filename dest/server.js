"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
class Server {
    constructor(port = constants_1.PORT) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.useMiddlewires();
    }
    useMiddlewires() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    start() {
        this.app.listen(this.port);
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map