import path from 'path';
import { Page } from 'puppeteer';
import PuppeteerVideoRecorder from 'puppeteer-video-recorder';

export class Recorder {
    protected recorder: any;

    constructor(
        protected page: Page, 
        protected filePath?: string
    ) {}

    async start() {
        this.recorder = new PuppeteerVideoRecorder();
        await this.recorder.init(
            this.page, 
            this.filePath || path.join(__dirname, '../recording.mp4')
        );
        await this.recorder.start();
    }

    async end() {
        await this.recorder.stop();
    }
}