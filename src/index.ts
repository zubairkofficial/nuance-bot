import { RequestHandler } from './request-handler';

function main() {
    const requestHandler = new RequestHandler();
    const portSuffix = requestHandler.port === 80 ? "" : ":" + requestHandler.port;
    console.log(`Server is listening at http://localhost${portSuffix}`);
}

main();