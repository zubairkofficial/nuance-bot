import fs from 'fs/promises';
import path from 'path';
import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { Recorder } from './recorder';
import { setTimeout } from 'timers/promises';
import { randomBetween } from './random';

export class Bot {
    protected browser: Browser;
    protected page: Page;
    protected joinerName = "The Recorder";
    public recorder: Recorder;

    constructor(
        protected meetingUrl: string,
        protected videoPath: string
    ) {}

    getChromeArgs() {
        return [
            "--disable-blink-features=AutomationControlled",
        ];
    }

    setPermissions() {
        const origin = new URL(this.meetingUrl).origin;
        this.browser.browserContexts()[0].overridePermissions(
            origin,
            ['camera', 'microphone']
        );
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

    async start() {
        this.browser = await puppeteer.launch({ 
            headless: true,
            args: this.getChromeArgs(),
            defaultViewport: null
        });
        this.setPermissions();

        this.page = await this.browser.newPage();
        this.setUserAgent();
        await this.page.goto(this.meetingUrl);
        
        this.recorder = new Recorder(this.page, this.videoPath);
    }

    async tryJoining() {
        const nameInput = await this.page.$('[aria-label="Your name"]');
        nameInput.type(this.joinerName);

        await setTimeout(
            randomBetween(2000, 5000)
        );

        const joinButton = await this.page.$('[jsname="Qx7uuf"]');
        joinButton.click();
    }

    async takeScreenshot(savePath?: string) {
        const screenshot = await this.page.screenshot();
        await fs.writeFile(
            savePath || path.join(__dirname, '../image.jpg'),
            screenshot
        );
    }

    async close() {
        await this.browser.close();
    }
}