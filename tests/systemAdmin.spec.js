require('dotenv').config();

const { test, expect } = require('@playwright/test');
const { CreateClientPage } = require('../functions/project');
const clientDetails = require('../functions/clientDetails.json');
const { LoginPage } = require('../functions/login')
const { ClientPage, inviteEpiqandSystemAdminAndAssert } = require('../functions/client');
const { CommonPage } = require('../functions/utilities');
const { getToastMessageLocator } = require('../functions/utilities');





test.beforeEach(async ({ page, context }) => {
    context.clearCookies();
    const loginPage = new LoginPage(page)
    await loginPage.navigate(process.env.BASE_URL);
    // Wait until the page is fully loaded
    await page.waitForLoadState('load');
    const h1Text = await page.locator('h1').textContent();
    expect(h1Text).toContain('Log In');

    //await loginPage.login(process.env.QA_CLIENTADMIN_USERNAME, process.env.QA_CLIENTADMIN_PASSWORD);
    await loginPage.login(process.env.SYSADMIN_USERNAME, process.env.SYSADMIN_PASSWORD);

}),

    test.describe('Client creation and validation', () => {

        test('Create a new client, search for it', async ({ page }) => {

            const formData = clientDetails.form;
            const clientPage = new ClientPage(page);
            const clientName = await clientPage.createClientAndReturnName(page, formData);
            const commonPage = new CommonPage(page);
            await commonPage.searchEntity(clientName, 'Client');
            const clientRow = page.locator('ul.company-list-ul span.docName', { hasText: clientName });
            await expect(clientRow).toBeVisible({ timeout: 40000 });
            const isClientRowVisible = await clientRow.isVisible();
            console.log('Is Client row visible?', isClientRowVisible);
            if (!isClientRowVisible) {
                throw new Error('Create Client row is not visible!');
            }
            await clientRow.click();
            await page.waitForTimeout(2000);


            await expect(clientPage.project).toBeVisible({ timeout: 10000 });
            const action = clientPage.project; // or any other locator you want to click
            await commonPage.highlightAndClick(action);
            await page.waitForTimeout(2000);


        });

        test('Verify/View client Info', async ({ page }) => {
            // if (!clientName) test.skip();
            // Assuming the clientName is set from the previous test
            const formData = clientDetails.form;
            const commonPage = new CommonPage(page);
            const clientPage = new ClientPage(page);
            const clientName = await clientPage.createClientAndReturnName(page, formData);

            // Now validate client info
            console.log('Validating client info for:', clientName);
            await commonPage.searchEntity(clientName, 'Client');
            const clientRow = page.locator('ul.company-list-ul span.docName', { hasText: clientName });
            await expect(clientRow).toBeVisible({ timeout: 40000 });
            await page.locator('a[href="/project/ClientSetting"] >> button', { hasText: 'Info' }).click();
            await page.waitForTimeout(2000);
            const clientNameValue = await page.locator('#clientName').inputValue();
            expect(clientNameValue).toBe(clientName);
            const streetField = formData.fields.find(f => f.label === 'Address');
            const expectedStreet = streetField.value;
            const streetValue = await page.locator(`textarea[placeholder="Address"]`).inputValue();
            expect(streetValue).toBe(expectedStreet);
            console.log('Street:', streetValue);
            const billingField = formData.fields.find(f => f.label === 'Enable Client Billing');
            const expectedChecked = billingField.checked;
            const isChecked = await page.locator('input[name="clientBilling"]').isChecked();
            expect(isChecked).toBe(expectedChecked);

        });
        test('Create Client with empty Client name - Check Validation message', async ({ page }) => {
            const clientPage = new ClientPage(page);
            await clientPage.createNewClientButton.click();
            await clientPage.clientNameInput.click();
            await clientPage.clientNameInput.fill(''); // Leave empty to trigger invalid state
            const createClientButton = page.getByRole('button', { name: 'Create Client' });
            await createClientButton.click();

            // Get the custom validity message
            const validationMessage = await clientPage.clientNameInput.evaluate(el => el.validationMessage);
            expect(validationMessage).toBe('Please fill out the field.');
        });
    });



test.describe('User Settings visibility', () => {
    ['SysAdmin'].forEach(link => {
        test(`should display user settings after ${link} login`, async ({ page }) => {
            const commonPage = new CommonPage(page);
            await commonPage.navigateToProfileLink(page, link);
            await commonPage.navigateToProfileLink(page, 'User Settings');
            await expect(page.getByTestId('profile-form').getByText('User Settings')).toBeVisible();
            await expect(page.getByText('My Profile')).toBeVisible();

        });
    });
});

test.describe('System Info visibility', () => {
    ['SysAdmin'].forEach(link => {
        test(`should display system info after ${link} login`, async ({ page }) => {
            //await page.getByRole('link', { name: link }).click();
            const commonPage = new CommonPage(page);
            await commonPage.navigateToProfileLink(page, link);
            await commonPage.navigateToProfileLink(page, 'System Info');
            await expect(page.getByText('Active Workers')).toBeVisible();
            await expect(page.getByText('Hovering Workers')).toBeVisible();
            await expect(page.getByText('Queued Fragments')).toBeVisible();
            await expect(page.locator('#wrapperContainer').getByText('Queued Jobs')).toBeVisible();

        });
    });
});

test.describe('Verify Visibility and Functionality of Left Panel Navigation Items', () => {

    test('Validate Left Panel Items Are Clickable and Functional', async ({ page }) => {
        const clientPage = new ClientPage(page);
        const utility = new CommonPage(page);
        await expect(clientPage.allClients).toBeVisible({ timeout: 10000 });
        const actions = [
            clientPage.allClients,
            clientPage.allClientJobs,
            clientPage.systemDashboard,
            clientPage.queuedJobs,
            clientPage.systemAdmins,
            clientPage.epiqAdmins,
            clientPage.disposition,
            clientPage.getAssistance
        ];

        for (const action of actions) {
            await utility.highlightAndClick(action);
            await page.waitForTimeout(2000);
        }

    });

    test.skip(`Validate 'All Client Jobs' Navigation Functionality`, async ({ page }) => {

        const clientPage = new ClientPage(page);
        const utility = new CommonPage(page);
        await expect(clientPage.allClients).toBeVisible({ timeout: 10000 });
        await utility.highlightAndClick(clientPage.allClientJobs);
        await utility.waitForLoadingToFinish();
        await clientPage.filterAllClientJobs({ client: 'Epiq Automation' });
        await clientPage.filterAllClientJobs({ jobStatus: 'Completed' });
        await clientPage.filterAllClientJobs({ submittedDate: 'Within one day' });
        await clientPage.filterAllClientJobs({ source: 'Personal Computer' });
        await page.waitForTimeout(5000);
    });

    test(`Validate 'System Dashboard' Navigation Functionality`, async ({ page }) => {
        const clientPage = new ClientPage(page);
        const utility = new CommonPage(page);
        await expect(clientPage.allClients).toBeVisible({ timeout: 10000 });
        await utility.highlightAndClick(clientPage.systemDashboard);
        await utility.waitForLoadingToFinish();
        const activeWorkersTab = page.getByText('Active Workers', { exact: true });
        await expect(activeWorkersTab).toBeVisible({ timeout: 10000 });
        await utility.highlight(activeWorkersTab);
    });

    test(`Validate 'Queued Jobs' Navigation Functionality`, async ({ page }) => {
        const clientPage = new ClientPage(page);
        const utility = new CommonPage(page);
        await expect(clientPage.allClients).toBeVisible({ timeout: 10000 });
        await utility.highlightAndClick(clientPage.queuedJobs);
        await utility.waitForLoadingToFinish();
        const jobID = page.getByText('Job ID', { exact: true });
        await expect(jobID).toBeVisible({ timeout: 10000 });
        await utility.highlight(jobID);

    });
    test(`Validate 'System Admins List' Navigation Functionality`, async ({ page }) => {
        const clientPage = new ClientPage(page);
        const utility = new CommonPage(page);
        await expect(clientPage.allClients).toBeVisible({ timeout: 10000 });
        await utility.highlightAndClick(clientPage.systemAdmins);
        await utility.waitForLoadingToFinish();
        await expect(clientPage.systemAdminsListText).toBeVisible({ timeout: 10000 });
        await utility.highlight(clientPage.systemAdminsListText);

    });

    test(`Validate 'Epiq Admins List' Navigation Functionality`, async ({ page }) => {
        const clientPage = new ClientPage(page);
        const utility = new CommonPage(page);
        await expect(clientPage.allClients).toBeVisible({ timeout: 10000 });
        await utility.highlightAndClick(clientPage.epiqAdmins);
        await utility.waitForLoadingToFinish();
        await expect(clientPage.epiqAdminsListText).toBeVisible({ timeout: 10000 });
        await utility.highlight(clientPage.epiqAdminsListText);
    });

    test(`Validate 'Dispostion page' Navigation Functionality`, async ({ page }) => {
        const clientPage = new ClientPage(page);
        const utility = new CommonPage(page);
        await expect(clientPage.allClients).toBeVisible({ timeout: 10000 });
        await utility.highlightAndClick(clientPage.disposition);
        await utility.waitForLoadingToFinish();
        const deleteClient = page.getByText('Delete Client', { exact: true });
        await expect(deleteClient).toBeVisible({ timeout: 10000 });
        await utility.highlight(deleteClient);
    });

});

test.describe('Verify Client Delete functionality', () => {
    test('Create a client, delete the client, and validate that the success toast message is displayed.', async ({ page }) => {
        const clientPage = new ClientPage(page);
        const formData = clientDetails.form;

        const clientName = await clientPage.createClientAndReturnName(page, formData);

        await clientPage.deleteClient(clientName);
        await page.waitForTimeout(5000);
    });
});

test.describe('Client Information Edit and Verification', () => {
    test('Update Client info and save', async ({ page }) => {

        const clientPage = new ClientPage(page);
        // Navigate to the client info page
        const clientInfo = await clientPage.getClientInfo('Epiq Automation');
        console.log('clientInfo:', clientInfo);
        // Update the value
        // Pass both phone and aiTextSummarization values in the object
        await clientPage.updateClientInfo('Epiq Automation', { phone: '816-739-8072', aiTextSummarization: true });
        //// 3. Verify the modified values are reflected in the UI
        // Verify the checkbox is checked
        await expect(clientPage.client_phone).toHaveValue('816-739-8072');

        const aiTextSummarizationCheckbox = clientPage.client_aiTextSummarization
        await expect(aiTextSummarizationCheckbox).toBeChecked();
        await clientPage.updateClientInfo('Epiq Automation', { phone: '816-739-8077', aiTextSummarization: false });

    });
});


test.describe('Verify Client list sort functionality', () => {
    test('should sort client list by name in ascending order', async ({ page }) => {
        const clientPage = new ClientPage(page);
        await clientPage.sortClientsByName('asc');
        // Wait for the sorting to complete
        const sortedClients = await clientPage.getSortedClientNames();
        expect(sortedClients).toEqual(sortedClients.sort());
    });
    test('should sort client list by name in descending order', async ({ page }) => {
        const clientPage = new ClientPage(page);
        await clientPage.sortClientsByName('desc');
        const sortedClients = await clientPage.getSortedClientNames();
        expect(sortedClients).toEqual(sortedClients.sort().reverse());
    });
});

test.describe('Invite System Admins', () => {

    test('should invite a new system admin with invalid email and verify the error message', async ({ page }) => {
        const clientPage = new ClientPage(page);
        const utility = new CommonPage(page);
        await expect(clientPage.allClients).toBeVisible({ timeout: 10000 });
        await utility.highlightAndClick(clientPage.systemAdmins);
        await utility.waitForLoadingToFinish();
        await expect(clientPage.systemAdminsListText).toBeVisible({ timeout: 10000 });
        await inviteEpiqandSystemAdminAndAssert(page, "srinivas@gmail.com", false);

    });

    test('should invite a new system admin with valid email verify the success toast message', async ({ page }) => {
        const clientPage = new ClientPage(page);
        const utility = new CommonPage(page);
        await expect(clientPage.allClients).toBeVisible({ timeout: 10000 });
        await utility.highlightAndClick(clientPage.systemAdmins);
        await utility.waitForLoadingToFinish();
        await expect(clientPage.systemAdminsListText).toBeVisible({ timeout: 10000 });
        await inviteEpiqandSystemAdminAndAssert(page, "srinuvasu.yarrala@epiqglobal.com", true);

    });

    test('verify system admin invite user dialog and cancel the dialog', async ({ page }) => {
        const clientPage = new ClientPage(page);
        await clientPage.systemAdminInviteDialog();
        await expect(clientPage.sysAdmin_Invite_Cancel).toBeVisible({ timeout: 10000 });
        await clientPage.sysAdmin_Invite_Cancel.click();


    });
});

test.describe('Invite Epiq Admins', () => {
    test('should invite a new Epiq admin with invalid email and verify the red toast message', async ({ page }) => {
        const clientPage = new ClientPage(page);
        const utility = new CommonPage(page);
        await expect(clientPage.allClients).toBeVisible({ timeout: 10000 });
        await utility.highlightAndClick(clientPage.epiqAdmins);
        await utility.waitForLoadingToFinish();
        await expect(clientPage.epiqAdminsListText).toBeVisible({ timeout: 10000 });
        await inviteEpiqandSystemAdminAndAssert(page, "srinuvasu.yarrala@gmail.com", false);
    });

    test('should invite a new Epiq admin with valid email verify the success toast message', async ({ page }) => {
        const clientPage = new ClientPage(page);
        const utility = new CommonPage(page);
        await expect(clientPage.allClients).toBeVisible({ timeout: 10000 });
        await utility.highlightAndClick(clientPage.epiqAdmins);
        await utility.waitForLoadingToFinish();
        await expect(clientPage.epiqAdminsListText).toBeVisible({ timeout: 10000 });
        await inviteEpiqandSystemAdminAndAssert(page, "srinuvasu.yarrala@epiqglobal.com", true);
    });
});



