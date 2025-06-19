import path from 'path';
import { fileURLToPath } from 'url';

import Page from './page.js';
import { withDynamicElements } from '../helpers/propertyLoader.js';
import { getTodayDateNumber, getTodayDateFormattedMMDDYYYY } from '../helpers/dateHelper.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RegistrationPage extends Page {
    constructor() {
        super();
        return withDynamicElements(this);
    }

    async open() {
        await super.open(); // goes to full site URL
        const frame = await $('iframe[data-testid="iframeResult"]');
        if (await frame.isExisting()) {
            await browser.switchToFrame(frame);
        }
    }

    async fillForm() {
        await this.NAME_INPUT.waitForDisplayed({ timeout: 5000 });
        await this.NAME_INPUT.setValue('Jane Doe');
        await this.GENDER_FEMALE.click();
        await this.COUNTRY_SELECT.selectByVisibleText('India');
    }

    async selectDate() {
        await this.DATE_INPUT.waitForClickable({ timeout: 5000 });
        await this.DATE_INPUT.click();

        const today = getTodayDateNumber();
        const dateElement = this.getLocator('CALENDAR_DATE_ELEMENT', today);;

        await dateElement.waitForClickable({ timeout: 5000 });
        await dateElement.click();
    }

    async uploadPhoto() {
        const filePath = path.join(__dirname, '../files/test-image.png');
        const remotePath = await browser.uploadFile(filePath);

        await this.PHOTO_UPLOAD_INPUT.waitForExist({ timeout: 5000 });
        await this.PHOTO_UPLOAD_INPUT.scrollIntoView();
        await this.PHOTO_UPLOAD_INPUT.setValue(remotePath);
    }

    async clickUploadSingleFileButton() {
        await this.UPLOAD_SINGLE_FILE_BUTTON.scrollIntoView();
        await this.UPLOAD_SINGLE_FILE_BUTTON.click();
    }

    async validateSelectedDate() {
        const value = await this.DATE_INPUT.getValue()
        const expected = getTodayDateFormattedMMDDYYYY();

        expect(value).toBe(expected);
    }

    async validateImageUploadedInfo() {
        const message = await this.FILE_UPLOAD_MESSAGE.getText();
        
        // TODO: Basic validation
        expect(message).toBe('Single file selected: test-image.png, Size: 88581 bytes, Type: image/png');
    }
}

export default new RegistrationPage();
