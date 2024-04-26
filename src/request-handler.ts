import path from 'path';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { setTimeout } from 'timers/promises';
import { Server } from './server';
import { Bot } from './bot';
import { FILES_PATH } from './constants';

export interface IRecordRequest {
    url: string;
}

export interface IEndRecordingRequest {
    id: string
}

export interface IMeeting {
    id: string;
    bot: Bot
}

export class RequestHandler extends Server {
    meetings: IMeeting[] = [];

    constructor() {
        super();
        this.route();
        this.start();
    }

    protected async record(req: Request, res: Response) {
        const { url } = req.body as IRecordRequest;
        const meetingId = uuidv4();
        const savePath = path.join(FILES_PATH, meetingId + '.mp4');

        const bot = new Bot(url, savePath);
        await bot.start();

        let attempts = 5;
        do {
            await setTimeout(5000);
            if (!await bot.noError()) {
                attempts--;
                await bot.reloadPage();
                continue;
            }
            
            await bot.takeScreenshot( path.join(FILES_PATH, `${meetingId}(${attempts}).jpg`) );
            await bot.tryJoining();
            await setTimeout(5000);

            if (!await bot.noError()) {
                attempts--;
                await bot.reloadPage();
                continue;
            }

            attempts = 0;
        } while (attempts > 0);
        
        await bot.recorder.start();
        this.meetings.push({ id: meetingId, bot });
        res.json({ recording: true, id: meetingId });
    }

    protected async endRecording(req: Request, res: Response) {
        const { id: meetingId } = req.body as IEndRecordingRequest;
        const meeting = this.meetings.find(m => m.id === meetingId);
        const captions = await meeting.bot.getCaptions();
        await meeting.bot.recorder.end();
        await meeting.bot.close();
        res.json({ recorded: true, id: meetingId, captions });
    }

    protected async getRecording(req: Request, res: Response) {
        const id = req.params.id;
        const filePath = path.join(FILES_PATH, id + '.mp4');
        res.download(filePath);
    }

    protected async getParticipants(req: Request, res: Response) {
        const id = req.params.id;
        const meeting = this.meetings.find(m => m.id === id);
        const participants = await meeting.bot.countParticipants();
        return res.json({ participants });
    }

    protected route() {
        this.app.post('/record', this.record.bind(this));
        this.app.post('/end-recording', this.endRecording.bind(this));
        this.app.get('/recording/:id', this.getRecording.bind(this));
        this.app.get('/participants/:id', this.getParticipants.bind(this));
    }
}