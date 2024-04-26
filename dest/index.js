"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_handler_1 = require("./request-handler");
function main() {
    const requestHandler = new request_handler_1.RequestHandler();
    const portSuffix = requestHandler.port === 80 ? "" : ":" + requestHandler.port;
    console.log(`Server is listening at http://localhost${portSuffix}`);
}
main();
//# sourceMappingURL=index.js.map