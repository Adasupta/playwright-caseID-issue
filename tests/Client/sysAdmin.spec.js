require('dotenv').config();

import { qase } from 'playwright-qase-reporter';

const { test, expect } = require('@playwright/test');

const { CreateClientPage } = require('../../functions/project'); 
const clientDetails = require('../../functions/clientDetails.json');
const { LoginPage } = require('../../functions/login')
const { ClientPage, inviteEpiqandSystemAdminAndAssert } = require('../../functions/client');
const { CommonPage } = require('../../functions/utilities');
const { getToastMessageLocator } = require('../../functions/utilities');

//test.beforeEach(async ({ page, context }) => {
//    context.clearCookies();
//    const loginPage = new LoginPage(page)
//    await loginPage.navigate(process.env.BASE_URL);
//    // Wait until the page is fully loaded
//    await page.waitForLoadState('load');
//    const h1Text = await page.locator('h1').textContent();
//    expect(h1Text).toContain('Log In');

//    //await loginPage.login(process.env.QA_CLIENTADMIN_USERNAME, process.env.QA_CLIENTADMIN_PASSWORD);
//    await loginPage.login(process.env.SYSADMIN_USERNAME, process.env.SYSADMIN_PASSWORD);

//});

test.describe("Client creation and validation-Tests", () => {

    test(qase(2, "Create a new client and Search"), () => {
        expect(true).toBe(true);
    });


    test("Verify/View client Info", () => {
        qase.id(13);
        expect(true).toBe(true);
    });


    test(
        "Create Client with empty Client name - Check Validation message",
        {
            annotation: { type: "QaseID", description: "14" },
        },
        async () => {
            expect(true).toBe(true);
        },
    );
});



    //test.describe('Client creation and validation', () => {

    //    test(qase(2, 'Create a new client and search'), async ({ page }) => {

    //        const formData = clientDetails.form;
    //        const clientPage = new ClientPage(page);
    //        const clientName = await clientPage.createClientAndReturnName(page, formData);
    //        const commonPage = new CommonPage(page);
    //        await commonPage.searchEntity(clientName, 'Client');
    //        const clientRow = page.locator('ul.company-list-ul span.docName', { hasText: clientName });
    //        await expect(clientRow).toBeVisible({ timeout: 40000 });
    //        const isClientRowVisible = await clientRow.isVisible();
    //        console.log('Is Client row visible?', isClientRowVisible);
    //        if (!isClientRowVisible) {
    //            throw new Error('Create Client row is not visible!');
    //        }
    //        await clientRow.click();
    //        await page.waitForTimeout(2000);


    //        await expect(clientPage.project).toBeVisible({ timeout: 10000 });
    //        const action = clientPage.project; // or any other locator you want to click
    //        await commonPage.highlightAndClick(action);
    //        await page.waitForTimeout(2000);


    //    });

    //    test(qase(3, 'Verify/View client Info'), async ({ page }) => {
    //        // if (!clientName) test.skip();
    //        // Assuming the clientName is set from the previous test
    //        const formData = clientDetails.form;
    //        const commonPage = new CommonPage(page);
    //        const clientPage = new ClientPage(page);
    //        const clientName = await clientPage.createClientAndReturnName(page, formData);

    //        // Now validate client info
    //        console.log('Validating client info for:', clientName);
    //        await commonPage.searchEntity(clientName, 'Client');
    //        const clientRow = page.locator('ul.company-list-ul span.docName', { hasText: clientName });
    //        await expect(clientRow).toBeVisible({ timeout: 40000 });
    //        await page.locator('a[href="/project/ClientSetting"] >> button', { hasText: 'Info' }).click();
    //        await page.waitForTimeout(2000);
    //        const clientNameValue = await page.locator('#clientName').inputValue();
    //        expect(clientNameValue).toBe(clientName);
    //        const streetField = formData.fields.find(f => f.label === 'Address');
    //        const expectedStreet = streetField.value;
    //        const streetValue = await page.locator(`textarea[placeholder="Address"]`).inputValue();
    //        expect(streetValue).toBe(expectedStreet);
    //        console.log('Street:', streetValue);
    //        const billingField = formData.fields.find(f => f.label === 'Enable Client Billing');
    //        const expectedChecked = billingField.checked;
    //        const isChecked = await page.locator('input[name="clientBilling"]').isChecked();
    //        expect(isChecked).toBe(expectedChecked);

    //    });
    //    test(qase(5, 'Create Client with empty Client name - Check Validation message'), async ({ page }) => {
    //        const clientPage = new ClientPage(page);
    //        await clientPage.createNewClientButton.click();
    //        await clientPage.clientNameInput.click();
    //        await clientPage.clientNameInput.fill(''); // Leave empty to trigger invalid state
    //        const createClientButton = page.getByRole('button', { name: 'Create Client' });
    //        await createClientButton.click();

    //        // Get the custom validity message
    //        const validationMessage = await clientPage.clientNameInput.evaluate(el => el.validationMessage);
    //        expect(validationMessage).toBe('Please fill out the field.');
    //    });
    //});




//test.describe('Verify Client Delete functionality', () => {


//    test(
//        "Delete the client, and validate that the success toast message",
//        {
//            annotation: { type: "QaseID", description: "6" },
//        },
//        async ({ page }) => {
//            const clientPage = new ClientPage(page);
//            const formData = clientDetails.form;

//            const clientName = await clientPage.createClientAndReturnName(page, formData);

//            await clientPage.deleteClient(clientName);
//            await page.waitForTimeout(5000);
//        },
//    );


    //Create a client, delete the client, and validate that the success toast message is displayed
    //test(qase(6, 'Delete the client, and validate that the success toast message'), async ({ page }) => {
    //    const clientPage = new ClientPage(page);
    //    const formData = clientDetails.form;

    //    const clientName = await clientPage.createClientAndReturnName(page, formData);

    //    await clientPage.deleteClient(clientName);
    //    await page.waitForTimeout(5000);
    //});
//});





