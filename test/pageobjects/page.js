import { browser } from '@wdio/globals'

export default class Page {
    open(path = '') {
        // NOTE: Always use full URL since baseUrl is not configured
        const base = 'https://testautomationpractice.blogspot.com';
        
        return browser.url(`${base}/${path}`);
    }
}
