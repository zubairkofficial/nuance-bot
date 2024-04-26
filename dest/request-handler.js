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
exports.RequestHandler = void 0;
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const promises_1 = require("timers/promises");
const server_1 = require("./server");
const bot_1 = require("./bot");
const constants_1 = require("./constants");
class RequestHandler extends server_1.Server {
    constructor() {
        super();
        this.meetings = [];
        this.route();
        this.start();
    }
    record(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url } = req.body;
            const meetingId = (0, uuid_1.v4)();
            const savePath = path_1.default.join(constants_1.FILES_PATH, meetingId + '.mp4');
            const bot = new bot_1.Bot(url, savePath);
            yield bot.start();
            let attempts = 5;
            do {
                yield (0, promises_1.setTimeout)(5000);
                if (!(yield bot.noError())) {
                    attempts--;
                    yield bot.reloadPage();
                    continue;
                }
                yield bot.takeScreenshot(path_1.default.join(constants_1.FILES_PATH, `${meetingId}(${attempts}).jpg`));
                yield bot.tryJoining();
                yield (0, promises_1.setTimeout)(5000);
                if (!(yield bot.noError())) {
                    attempts--;
                    yield bot.reloadPage();
                    continue;
                }
                attempts = 0;
            } while (attempts > 0);
            yield bot.recorder.start();
            this.meetings.push({ id: meetingId, bot });
            res.json({ recording: true, id: meetingId });
        });
    }
    endRecording(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: meetingId } = req.body;
            const meeting = this.meetings.find(m => m.id === meetingId);
            const captions = yield meeting.bot.getCaptions();
            yield meeting.bot.recorder.end();
            yield meeting.bot.close();
            res.json({ recorded: true, id: meetingId, captions });
        });
    }
    getRecording(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const filePath = path_1.default.join(constants_1.FILES_PATH, id + '.mp4');
            res.download(filePath);
        });
    }
    getParticipants(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const meeting = this.meetings.find(m => m.id === id);
            const participants = yield meeting.bot.countParticipants();
            return res.json({ participants });
        });
    }
    route() {
        this.app.post('/record', this.record.bind(this));
        this.app.post('/end-recording', this.endRecording.bind(this));
        this.app.get('/recording/:id', this.getRecording.bind(this));
        this.app.get('/participants/:id', this.getParticipants.bind(this));
    }
}
exports.RequestHandler = RequestHandler;
//# sourceMappingURL=request-handler.js.map