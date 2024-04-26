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
exports.Recorder = void 0;
const path_1 = __importDefault(require("path"));
const puppeteer_screen_recorder_1 = require("puppeteer-screen-recorder");
class Recorder {
    constructor(page, filePath) {
        this.page = page;
        this.filePath = filePath;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.recorder = new puppeteer_screen_recorder_1.PuppeteerScreenRecorder(this.page);
            yield this.recorder.start(this.filePath || path_1.default.join(__dirname, '../recording.mp4'));
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.recorder.stop();
        });
    }
}
exports.Recorder = Recorder;
//# sourceMappingURL=recorder-video-only.js.map