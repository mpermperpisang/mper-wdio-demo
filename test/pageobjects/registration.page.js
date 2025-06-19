import path from 'path';
import { fileURLToPath } from 'url';

import Page from './page.js';
import { getTodayDateNumber, getTodayDateFormattedMMDDYYYY } from '../helpers/dateHelper.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RegistrationPage extends Page {
    get nameInput() { return $('#name'); }
    get genderFemale() { return $('#female'); }
    get countrySelect() { return $('#country'); }
    get dateInput() { return $('#datepicker'); }
    getCalendarDateElement(day) {
        return $(`//a[normalize-space(text())='${day}']`);
    }
    get photoUploadInput() { return $('#singleFileInput'); }
    get uploadSingleFileButton() { return $('//*[text()="Upload Single File"]'); }
    get fileUploadMessage() { return $('#singleFileStatus') }

    async open() {
        await super.open(); // goes to full site URL
        const frame = await $('iframe[data-testid="iframeResult"]');
        if (await frame.isExisting()) {
            await browser.switchToFrame(frame);
        }
    }

    async fillForm() {
        await this.nameInput.waitForDisplayed({ timeout: 5000 });
        await this.nameInput.setValue('Jane Doe');
        await this.genderFemale.click();
        await this.countrySelect.selectByVisibleText('India');
    }

    async selectDate() {
        await this.dateInput.waitForClickable({ timeout: 5000 });
        await this.dateInput.click();

        const today = getTodayDateNumber();
        const dateElement = this.getCalendarDateElement(today);

        await dateElement.waitForClickable({ timeout: 5000 });
        await dateElement.click();
    }

    async uploadPhoto() {
        const filePath = path.join(__dirname, '../files/test-image.png');
        const remotePath = await browser.uploadFile(filePath);

        await this.photoUploadInput.waitForExist({ timeout: 5000 });
        await this.photoUploadInput.scrollIntoView();
        await this.photoUploadInput.setValue(remotePath);
    }

    async clickUploadSingleFileButton() {
        await this.uploadSingleFileButton.scrollIntoView();
        await this.uploadSingleFileButton.click();
    }

    async validateSelectedDate() {
        const value = await this.dateInput.getValue()
        const expected = getTodayDateFormattedMMDDYYYY();

        expect(value).toBe(expected);
    }

    async validateImageUploadedInfo() {
        const message = await this.fileUploadMessage.getText();
        
        // TODO: Basic validation
        expect(message).toBe('Single file selected: test-image.png, Size: 88581 bytes, Type: image/png');
    }
}

export default new RegistrationPage();
