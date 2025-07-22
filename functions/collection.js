const fs = require('fs');
const path = require('path');
require('dotenv').config();
class CollectionPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.localBox = page.locator('div.collect-box:has(h4:text("Local"))');
        this.nameInput = page.locator('input[name="name"]');
        this.sourceDropdown = page.locator('div.input-sec:has(label:has-text("Source")) select.w-full');
        this.custodianDropdown = page.locator('div.input-sec:has(label:has-text("Custodian")) select.w-full');
        this.fileInput = page.locator('input[data-testid="drag-upload-file"]');
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.processAutomationRadio = page.locator('div.main-btn:has(.radio-label:text("Process Automation")) .radio-custom');
        this.filterPromoteRadio = page.locator('div.flex:has(.radio-label:text("Filter / Promote or Export")) .radio-custom');
        this.imageRadio = page.locator('div.flex:has(.radio-label:text("Image")) .radio-custom');
        this.produceRadio = page.locator('div.flex:has(.radio-label:text("Produce")) .radio-custom');
        this.nextButton = page.getByRole('button', { name: 'Next' });


    }


    /**
 *  collects all files in a directory.
 **/
    getAllFiles(dir) {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(getAllFiles(filePath));
            } else {
                results.push(filePath);
            }
        });
        return results;
    }

    /**
     * Fills the collection form with provided values.
     */
    async unchainedCollectionJob(name, sourceLabel, custodianLabel) {
        //await this.localBox.click();
        //await this.page.locator('form').filter({ hasText: 'NameSourcePersonal' }).locator('i').nth(1).click();
        await this.page.waitForTimeout(1000);
        await this.nameInput.waitFor({ state: 'visible' });
        await this.nameInput.click();
        await this.nameInput.fill(name);
        // source dropdown
        await this.sourceDropdown.click();
        await this.sourceDropdown.selectOption({ label: sourceLabel });


        // Custodian dropdown

        await this.custodianDropdown.click();
        await this.custodianDropdown.selectOption({ label: custodianLabel });

        await this.nextButton.click();
    }

    async runChainedJobsProcessThroughProduce(page, { process, filter } = {}) {

        if (process && filter) {
            await this.processAutomationRadio.click();
            await page.waitForTimeout(1000);
            await this.filterPromoteRadio.click();
            await page.waitForTimeout(1000);
            await this.nextButton.click();
        } else if (process && filter && image) {
            await this.processAutomationRadio.click();
            await page.waitForTimeout(1000);
            await this.filterPromoteRadio.click();
            await page.waitForTimeout(1000);
            await this.imageRadio.click();
            await this.nextButton.click();
        } else if (process && filter && image && produce) {
            await this.processAutomationRadio.click();
            await page.waitForTimeout(1000);
            await this.filterPromoteRadio.click();
            await page.waitForTimeout(1000);
            await this.imageRadio.click();
            await page.waitForTimeout(1000);
            await this.produceRadio.click()
            await page.waitForTimeout(1000);
            await this.nextButton.click();
        }
        else {
            await this.processAutomationRadio.click();
            await page.waitForTimeout(1000);
            await this.nextButton.click();
        }
    }

    /**
 * Collects files from a directory and uploads them using Playwright.
 */
    async collectDir(specdir, caseId, input) {
        if (specdir === "DEFAULT") {
            specdir = path.join(process.env.FILE_SERVER_PATH, caseId, 'Data');
        }
        if (specdir === "smoke") {
            // Simulate partial location logic if needed
            //const partialLocation = process.cwd(); // Adjust as needed
            specdir = path.join(process.env.FILE_SERVER_PATH, caseId, 'Data');
            //console.log("partial location", partialLocation);
            console.log("DataPath:", specdir);
        }
        if (specdir === "parameter") {
            if (caseId) {
                specdir = path.join(process.env.FILE_SERVER_PATH, caseId, 'Data');
            } else {
                specdir = process.env.FILE_SERVER_PATH;
            }
        }

        console.log("DataPath:", specdir);

        const files = this.getAllFiles(specdir);

        for (const file of files) {

            for (let i = 0; i < 10; i++) {
                try {
                    await input.fill(''); // Clear input
                    break;
                } catch (e) {
                    await new Promise(res => setTimeout(res, 1000));
                }
            }
            
            await input.setInputFiles(file);
            //await input.setInputFiles(file);
            console.log("Collection upload file list:", file);

        }
    }
}

module.exports = { CollectionPage };
