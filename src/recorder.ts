import fs, { WriteStream } from 'fs';
import { Transform } from 'stream';
import { Page } from 'puppeteer-stream/node_modules/puppeteer-core';
import { getStream } from 'puppeteer-stream';
import { setTimeout } from 'timers/promises';

export class Recorder {
    protected stream: Transform;
    protected file: WriteStream;

    constructor(
        protected page: Page, 
        protected filePath?: string
    ) {}

    async start() {
        this.file = fs.createWriteStream(this.filePath);
        this.stream = await getStream(this.page, { audio: true, video: true });
        this.stream.pipe(this.file);
    }

    async end() {
        try {
            await new Promise((resolve, reject) => {
                // this.stream.destroy();
                this.file.close(err => {
                    if (err) reject(err);
                    else resolve(void 0);
                });
            });
            await setTimeout(500);
        } catch (error) {
            console.error(error);
        }
    }
}