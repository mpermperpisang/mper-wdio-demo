import path from 'path';
import { fileURLToPath } from 'url';
import Page from './page.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RegistrationPage extends Page {
    get nameInput() { return $('#name'); }
    get genderFemale() { return $('#female'); }
    get countrySelect() { return $('#country'); }
    get dateInput() { return $('#datepicker'); }
    get calendarDate15() { return $('//a[text()="15"]'); }
    get photoUploadInput() { return $('#singleFileInput'); }
    get submitButton() { return $('//*[text()="Upload Single File"]'); }
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
        await this.calendarDate15.waitForClickable({ timeout: 5000 });
        await this.calendarDate15.click();
    }

    async uploadPhoto() {
        const filePath = path.join(__dirname, '../files/test-image.png');
        const remotePath = await browser.uploadFile(filePath);

        await this.photoUploadInput.waitForExist({ timeout: 5000 });
        await this.photoUploadInput.scrollIntoView();
        await this.photoUploadInput.setValue(remotePath);
    }

    async submit() {
        await this.submitButton.scrollIntoView();
        await this.submitButton.click();
    }

    async validateImageUploadedInfo() {
        const message = await this.fileUploadMessage.getText();
        // TODO: Basic validation
        expect(message).toBe('Single file selected: test-image.png, Size: 88581 bytes, Type: image/png');
    }
}

export default new RegistrationPage();
