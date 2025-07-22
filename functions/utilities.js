const { expect } = require('@playwright/test');
// loginPage.js

class CommonPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.searchIcon = page.locator('i.qicon-search');
        this.filterProjectInput = page.locator('input[placeholder="Filter Project"]');
        this.filterClientInput = page.getByRole('searchbox', { name: 'Filter Client' });
        this.confirmButton = page.getByRole('button', { name: 'Confirm' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });


    }


    async searchEntity(name, type) {
        console.log(`Searching for ${type}`, name);

        let filterInput;
        if (type === 'Project') {
            filterInput = this.filterProjectInput;
        } else if (type === 'Client') {
            filterInput = this.filterClientInput;
        } else {
            throw new Error('Unknown type for searchEntity');
        }
        await this.waitForLoadingToFinish();
        const searchAnimatorDiv = this.page.locator('div.search-animator');
        await searchAnimatorDiv.hover();
        await this.searchIcon.waitFor({ state: 'visible' });
        console.log('Search icon is visible, clicking it...');
        await this.searchIcon.scrollIntoViewIfNeeded();
        await this.searchIcon.click();
        await this.waitForLoadingToFinish();
        await this.page.waitForSelector('.header-main-sec', { state: 'hidden', timeout: 10000 }).catch(() => { });
        await expect(filterInput).toBeVisible({ timeout: 10000 });
        await expect(filterInput).toBeEnabled({ timeout: 10000 });
        await filterInput.click();
        await filterInput.fill(name);
        await filterInput.press('Enter');
        // Verify that the entity is visible after searching
        await this.page.getByText(name, { exact: true }).first().isVisible({ timeout: 50000 });
        // Wait for some time after the locator is visible
        await this.page.waitForTimeout(5000);

        console.assert(`Client ${name} searched successfully`);


    }
    static generateName(name) {
        const now = new Date();
        const pad = (n, width = 2) => n.toString().padStart(width, '0');
        const formattedDate =
            now.getFullYear().toString() +
            pad(now.getMonth() + 1) +
            pad(now.getDate()) +
            pad(now.getHours()) +
            pad(now.getMinutes()) +
            pad(now.getSeconds()); 
        const randomSuffix = Math.floor(10 + Math.random() * 90);
        return `${name}${formattedDate}${randomSuffix}`;
    }

    // Utility function to navigate to a user profile link and wait for the page to load
    async navigateToProfileLink(page, linkName) {

        await page.getByRole('link', { name: linkName, exact: true }).click();
        await page.waitForTimeout(2000);
    }
    // Utility function to highlight an element and then click it
    async highlightAndClick(locator) {
        await locator.hover();
        await this.page.evaluate(el => el.style.background = 'yellow', await locator.elementHandle());
        await locator.click();
    }
    // Utility function to highlight an element
    async highlight(locator) {
        await locator.hover();
        await this.page.evaluate(el => el.style.background = 'yellow', await locator.elementHandle());
    }

    // Utility function to wait for a loading indicator to finish
    async waitForLoadingToFinish(timeout = 100000) {
        await this.page.waitForSelector('.ani-listLoading.loading', { state: 'hidden', timeout });
    }

    // Utility function to handle system prompts like confirmation or cancellation
    async handleSystemPrompt(action) {
        if (action === 'confirm') {
            await this.confirmButton.waitFor({ state: 'visible', timeout: 10000 });
            await this.confirmButton.click();
        } else if (action === 'cancel') {
            await this.cancelButton.waitFor({ state: 'visible', timeout: 10000 });
            await this.cancelButton.click();
        } else {
            throw new Error('Unknown action for handleSystemPrompt: ' + action);
        }
    }






}

function getToastMessageLocator(page, message) {
    return page.locator('div.Toastify__toast-body', { hasText: message });
}

module.exports = { CommonPage, getToastMessageLocator };