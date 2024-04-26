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

    async record(req: Request, res: Response) {
        const { url } = req.body as IRecordRequest;
        const meetingId = uuidv4();
        const savePath = path.join(FILES_PATH, meetingId + '.mp4');

        const bot = new Bot(url, savePath);
        await bot.start();
        await bot.recorder.start();
        await setTimeout(5000);
        
        let retries = 3;
        do {
            try {
                await bot.takeScreenshot( path.join(FILES_PATH, `${meetingId}(${retries}).jpg`) );
                await bot.tryJoining();
                retries = 0;
            } catch {
                retries--;
            }
        } while (retries > 0);

        this.meetings.push({ id: meetingId, bot });

        res.json({ recording: true, id: meetingId });
    }

    async endRecording(req: Request, res: Response) {
        const { id: meetingId } = req.body as IEndRecordingRequest;
        const meeting = this.meetings.find(m => m.id === meetingId);
        await meeting.bot.recorder.end();
        await meeting.bot.close();
        res.json({ recorded: true, id: meetingId });
    }

    async getRecording(req: Request, res: Response) {
        const id = req.params.id;
        const filePath = path.join(FILES_PATH, id + '.mp4');
        res.download(filePath);
    }

    route() {
        this.app.post('/record', this.record.bind(this));
        this.app.post('/end-recording', this.endRecording.bind(this));
        this.app.get('/recording/:id', this.getRecording.bind(this));
    }
}