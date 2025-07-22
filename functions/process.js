require('dotenv').config();
const { test, expect } = require('@playwright/test');


class ProcessPage {

    
    constructor(page) {
        this.page = page;
        this.processAutomationRadio = page.locator('div.main-btn:has(.radio-label:text("Process Automation")) .radio-custom');
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.processSubmitButton = page.getByRole('button', { name: 'Submit' });


    }
    checkboxByName(name) {
        return this.page.locator(
            `ul.tableRow:has(span:has-text("${name}")) li.produce_setting_detail input[type="checkbox"]`
        );
    }
}
module.exports = { ProcessPage }