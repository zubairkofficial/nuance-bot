"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptionRecorder = void 0;
class CaptionRecorder {
    constructor() {
        this.observedElement = ".iOzk7";
        this.captions = "";
        this.recordCaptions();
    }
    recordCaptions() {
        const element = document.querySelector(this.observedElement);
        if (!element) {
            console.error("Observed element not found");
            return;
        }
        const observer = new MutationObserver(this.handleMutations.bind(this));
        observer.observe(element, {
            childList: true,
            subtree: true,
            characterData: true,
            characterDataOldValue: true
        });
    }
    handleMutations(mutations) {
        for (const mutation of mutations) {
            switch (mutation.type) {
                case 'characterData':
                    this.handleCharacterData(mutation);
                    break;
                case 'childList':
                    this.handleChildList(mutation);
                    break;
            }
        }
        // console.log(this.captions);
    }
    handleCharacterData(mutation) {
        const newValue = mutation.target.textContent.trim();
        let appendValue = false;
        if (mutation.oldValue &&
            this.captions.endsWith(mutation.oldValue.trim())) {
            this.captions = this.captions.substring(0, this.captions.lastIndexOf(mutation.oldValue.trim()));
            appendValue = true;
        }
        else if (!this.captions.includes(newValue)) {
            appendValue = true;
        }
        if (appendValue) {
            const shouldPrependSpace = this.captions.length > 0 && !this.captions.endsWith(" ");
            this.captions += (shouldPrependSpace ? " " : "") + newValue;
        }
    }
    handleChildList(mutation) {
        if (mutation.addedNodes.length === 0)
            return;
        const additionalText = [...mutation.addedNodes]
            .map(node => node.textContent.trim())
            .join(' ');
        if (!this.captions.endsWith(additionalText)) {
            const shouldPrependSpace = this.captions.length > 0 && !this.captions.endsWith(" ");
            this.captions += (shouldPrependSpace ? " " : "") + additionalText;
        }
    }
}
exports.CaptionRecorder = CaptionRecorder;
//# sourceMappingURL=caption-recorder.js.map