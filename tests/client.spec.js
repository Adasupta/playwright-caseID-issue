require('dotenv').config();

const { test, expect } = require('@playwright/test');
const { CreateClientPage } = require('../functions/project');
const clientDetails = require('../functions/clientDetails.json');
const { LoginPage } = require('../functions/login')
const { ClientPage } = require('../functions/client');
const { CommonPage } = require('../functions/utilities');
const { getToastMessageLocator } = require('../functions/utilities');

//file to be deleted

test.beforeEach(async ({ page, context }) => {
    context.clearCookies();
    const loginPage = new LoginPage(page)
    await loginPage.navigate(process.env.BASE_URL);

    await page.waitForLoadState('load');
    const h1Text = await page.locator('h1').textContent();
    expect(h1Text).toContain('Log In');
    await loginPage.login(process.env.SYSADMIN_USERNAME, process.env.SYSADMIN_PASSWORD);


});

test.describe('Client Dashboard validations', () => {
    ['ClientDashboard'].forEach(link => {
        test.skip('Validate the all Project counts match with DB', async ({ page }) => {
        });
        test.skip('Validate the Active Users counts match with DB', async ({ page }) => {
        });
        test.skip('Validate the Collected Project counts match with DB', async ({ page }) => {
        });
        test.skip('Validate the Processed Project counts match with DB', async ({ page }) => {
        });
        test.skip('Validate the Hosted Project counts match with DB', async ({ page }) => {
        });
        test.skip('Check for Overview & Hosting Size graphs appear with details', async ({ page }) => {
        });
        test.skip('Download the Project list', async ({ page }) => {
        });
        //This filter is to apply filters in Hostlisting Size Breakdown filter and Last 30day usage filter
        test.skip('Apply filters for projects and verify the list', async ({ page }) => {
        });
    });
});
      



    test.describe('Client Prjoect Archive validations', () => {
        test.skip('Archieve an existing project', async ({ page }) => {
            const clientPage = new ClientPage(page);
        });

        test.skip('Sort / filter - Archieved Projects', async ({ page }) => {
            const clientPage = new ClientPage(page);
        });
        test.skip('Restore - Archieved Projects', async ({ page }) => {
            const clientPage = new ClientPage(page);
        });
    });

    test.describe('Client Report validations', () => {
        test.skip('Create or Generate a report', async ({ page }) => {
            const clientPage = new ClientPage(page);
        });

        test.skip('Search for an existing report', async ({ page }) => {
            const clientPage = new ClientPage(page);
        });
        test.skip('Download a report', async ({ page }) => {
            const clientPage = new ClientPage(page);
        });
    });


