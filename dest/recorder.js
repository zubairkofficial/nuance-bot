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
const fs_1 = __importDefault(require("fs"));
const puppeteer_stream_1 = require("puppeteer-stream");
const promises_1 = require("timers/promises");
class Recorder {
    constructor(page, filePath) {
        this.page = page;
        this.filePath = filePath;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.file = fs_1.default.createWriteStream(this.filePath);
            this.stream = yield (0, puppeteer_stream_1.getStream)(this.page, { audio: true, video: true });
            this.stream.pipe(this.file);
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield new Promise((resolve, reject) => {
                    // this.stream.destroy();
                    this.file.close(err => {
                        if (err)
                            reject(err);
                        else
                            resolve(void 0);
                    });
                });
                yield (0, promises_1.setTimeout)(500);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.Recorder = Recorder;
//# sourceMappingURL=recorder.js.map