import { RequestHandler } from './request-handler';

function main() {
    new RequestHandler();
    console.log("Server is listening at http://localhost");
}

main();