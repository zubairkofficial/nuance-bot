import path from 'path';
import { Page } from 'puppeteer';
import { PuppeteerScreenRecorder } from 'puppeteer-screen-recorder';

export class Recorder {
    protected recorder: PuppeteerScreenRecorder;

    constructor(
        protected page: Page, 
        protected filePath?: string
    ) {}

    async start() {
        this.recorder = new PuppeteerScreenRecorder(this.page);
        await this.recorder.start(
            this.filePath || path.join(__dirname, '../recording.mp4')
        );
    }

    async end() {
        await this.recorder.stop();
    }
}