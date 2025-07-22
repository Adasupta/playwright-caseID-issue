require('dotenv').config();
const { test, expect } = require('@playwright/test');

class FilterPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.filterJobName = page.locator('input[placeholder="Filter Job Name"]');
        this.filterDataName = page.locator('input[type="search"][id="multi-select-inputsourceDataName"]');
        this.dataNameCheckbox = page.getByTestId('dropdown-sourceDataName').locator('i');
        this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
        this.selectTemplateDropdown = page.locator('select[name="selectvalue"]');
        this.startAutomaticallyRadio = page.locator('input[type="radio"][id="FilterRadio1"]');
        this.promoteRadio = page.locator('input[type="radio"][id="FilterRadio2"]');
        this.exportRadio = page.locator('input[type="radio"][id="FilterRadio3"]');
        this.filterJobNameCheckbox = page.locator('input[type="checkbox"][id="multiselect-search-job"]');
        //this.filterDataNameCheckbox = page.locator('input[type="checkbox"][id="multiselect-search-data"]');
        this.createButton = page.getByRole('button', { name: 'Create' });
        this.selectDataNameButton = page.getByRole('button', { name: '--Select DataName--' });
        this.filterTempNameTextbox = page.locator('input[placeholder="Please enter template name"]');
        this.runButton = page.getByRole('button', { name: 'Run' });


       
    }
    async selectTemplateDropdownValue(optionText) {
        let value;
        switch (optionText) {
            case 'Create New':
                value = '';
                break;
            case 'All Unique Documents':
                value = '1';
                break;
            default:
                throw new Error(`Unknown option: ${optionText}`);
        }
        await this.selectTemplateDropdown.selectOption(value);

    }
    async selectStartAutomaticallyOption(option) {
        switch (option) {
            case 'Promote':
                if (!(await this.promoteRadio.isChecked())) {
                    await this.promoteRadio.check();
                }
                break;
            case 'Export':
                if (!(await this.exportRadio.isChecked())) {
                    await this.exportRadio.check();
                }
                break;
            default:
                if (!(await this.startAutomaticallyRadio.isChecked())) {
                    await this.startAutomaticallyRadio.check();
                }
        }
    }

    async clickDataNameCheckbox(dataName) {
        console.log(`Clicking on DataName checkbox for: ${dataName}`);
        const dataNameCheckbox = this.page.getByTestId(`link-sourceDataName-0`);
        //const dataNameCheckbox = this.page.locator(`//a[.//span[@title="${dataName}"]]/i`);
        //await this.page.locator('//a[.//span[@title="TC305074"]]/i').click();

        await dataNameCheckbox.click();
        await this.page.waitForTimeout(2000);
        const dataNamedropdown = this.page.getByRole('button', { name: `${dataName}`, exact: true });
        await dataNamedropdown.scrollIntoViewIfNeeded();
        await dataNamedropdown.waitFor({ state: 'visible' });
        await dataNamedropdown.click();
        

       // await this.filterDataName.click();
    }




    
}

module.exports = { FilterPage }



    
