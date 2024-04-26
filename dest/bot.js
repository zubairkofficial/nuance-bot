"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const puppeteer_stream_1 = require("puppeteer-stream");
const recorder_1 = require("./recorder");
const promises_2 = require("timers/promises");
const random_1 = require("./random");
const caption_recorder_1 = require("./caption-recorder");
const chrome_paths_1 = __importDefault(require("chrome-paths"));
class Bot {
    constructor(meetingUrl, videoPath) {
        this.meetingUrl = meetingUrl;
        this.videoPath = videoPath;
        this.joinerName = "The Recorder";
    }
    getChromeArgs() {
        return [
            "--disable-blink-features=AutomationControlled",
        ];
    }
    setPermissions() {
        const origin = new URL(this.meetingUrl).origin;
        this.browser.browserContexts()[0].overridePermissions(origin, ['camera', 'microphone']);
    }
    setUserAgent() {
        this.page.setExtraHTTPHeaders({
            'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
            'sec-ch-ua-arch': '"x86"',
            'sec-ch-ua-bitness': '"64"',
            'sec-ch-ua-full-version': '"120.0.0.0"',
            'sec-ch-ua-full-version-list': '"Not/A)Brand";v="120.0.0.0", "Google Chrome";v="120.0.0.0", "Chromium";v="120.0.0.0"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': '""',
            'sec-ch-ua-platform': 'Windows',
            'sec-ch-ua-platform-version': '15.0.0',
            'sec-ch-ua-wow64': '?0',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.browser = yield (0, puppeteer_stream_1.launch)({
                headless: true,
                args: this.getChromeArgs(),
                defaultViewport: null,
                executablePath: chrome_paths_1.default.chrome
            });
            this.setPermissions();
            this.page = yield this.browser.newPage();
            this.setUserAgent();
            yield this.page.goto(this.meetingUrl);
            this.recorder = new recorder_1.Recorder(this.page, this.videoPath);
        });
    }
    reloadPage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.reload();
        });
    }
    noError() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorElement = yield this.page.$('[jsname="r4nke"]');
            return !errorElement;
        });
    }
    tryJoining() {
        return __awaiter(this, void 0, void 0, function* () {
            const nameInput = yield this.page.$('[aria-label="Your name"]');
            nameInput.type(this.joinerName);
            yield (0, promises_2.setTimeout)((0, random_1.randomBetween)(2000, 5000));
            const joinButton = yield this.page.$('[jsname="Qx7uuf"]');
            joinButton.click();
            yield (0, promises_2.setTimeout)(2000);
            let remainingAttempts = 20;
            while (!(yield this.recordCaptions()) && remainingAttempts-- > 0)
                yield (0, promises_2.setTimeout)(2000);
        });
    }
    countParticipants() {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield this.page.evaluate("document.querySelector(\".uGOf1d\")?.textContent || \"0\"");
            return Number(count);
        });
    }
    takeScreenshot(savePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const screenshot = yield this.page.screenshot();
            yield promises_1.default.writeFile(savePath || path_1.default.join(__dirname, '../image.jpg'), screenshot);
        });
    }
    recordCaptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const captionsButton = yield this.page.$('[jscontroller="xzbRj"]');
            if (captionsButton) {
                captionsButton.click();
                this.page.evaluate(`
                ${caption_recorder_1.CaptionRecorder}
                const captionRecorder = new CaptionRecorder();
            `);
                return true;
            }
            else {
                return false;
            }
        });
    }
    getCaptions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.page.evaluate("captionRecorder.captions");
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.browser.close();
        });
    }
}
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map