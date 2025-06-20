import RegistrationPage from '../pageobjects/registration.page.js'

describe('WEB Automation Testing - https://testautomationpractice.blogspot.com/', () => {
    it('As a User, I want to select date picker and upload image successfully', async () => {
        await RegistrationPage.open();
        await RegistrationPage.fillForm();
        await RegistrationPage.selectDate();
        await RegistrationPage.uploadPhoto();
        await RegistrationPage.clickUploadSingleFileButton();
        await RegistrationPage.validateSelectedDate();
        await RegistrationPage.validateImageUploadedInfo();
    });
});
