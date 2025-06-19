import RegistrationPage from '../pageobjects/registration.page.js'

describe('WEB Automation Testing - https://testautomationpractice.blogspot.com/', () => {
    it('should fill form, select date, upload image and submit', async () => {
        await RegistrationPage.open();
        await RegistrationPage.fillForm();
        await RegistrationPage.selectDate();
        await RegistrationPage.uploadPhoto();
        await RegistrationPage.submit();
        await RegistrationPage.validateImageUploadedInfo();
    });
});
