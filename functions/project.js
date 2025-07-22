const { expect } = require('@playwright/test');
const { getToastMessageLocator } = require('../functions/utilities');
const { CommonPage } = require('../functions/utilities');
const { ClientPage } = require('../functions/client');

// loginPage.js

class CreateClientPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.loginLogo = page.locator('[class="large-logo"]');
        this.createProjectButton = page.locator('[title="Create New Project"]');
        this.projectNameInput = page.locator('[name="projectName"]');
        this.projectDescInput = page.locator('[name="projectDescription"]');
        this.loginErrMessage = page.locator('p', { hasText: 'Invalid code, try again' });
        this.createProjButton = page.getByRole('button', { name: 'Create Project' });
        this.projtoastMessage = page.locator('div.Toastify__toast-body');
        this.searchAnimatorDiv = page.locator('div.search-animator');
        this.filterProjectInput = page.locator('input[placeholder="Filter Project"]');
        this.clickProjectInfoButton = page.getByRole('button', { name: 'Info' });
        this.createCustodian = page.locator('#CreateCustodian');
        this.custodianFirstName = page.locator('input[placeholder="First Name"]');
        this.custodianLastName = page.locator('input[placeholder="Last Name"]');
        this.accountMenu = page.locator('a p[title="Account Menu"]');
        this.allClients = page.getByRole('link', { name: 'All Clients' });
        this.invite_button = page.locator('button#companySet-addUser', { hasText: 'Invite' })
        this.sendButton = page.locator('button[type="submit"]', { hasText: 'Send' });
        this.userEmail = page.locator('input[name="userEmail"]');
        this.userFirstName = page.locator('input[name="userFirstName"]');
        this.userLastName = page.locator('input[name="userLastName"]');
        this.projectDropdown = page.locator('select[name="projectId"]');
        this.roleDropdown = page.locator('select[name="roleId"]');


    }




    async createProject(name, description) {
        //await this.loginLogo.waitFor({ state: 'visible' });
        console.log('Creating project with name:', name, 'and description:', description);
        await this.createProjectButton.click();
        const expectedText = 'Create New Project';
        await this.verifyH3Displayed(expectedText);
        await this.projectNameInput.fill(name);
        await this.projectDescInput.fill(description);
        await this.createProjButton.click();

        const toastMessage = getToastMessageLocator(this.page, `Project [${name}] created successfully`);
        await expect(toastMessage).toBeVisible({ timeout: 40000 });
        const isVisible = await toastMessage.isVisible();
        console.log('Is create project toast message visible?', isVisible);

        if (!isVisible) {
            throw new Error('Create Project toast message is not visible!');
        }

    }
    async verifyH3Displayed(expectedText) {
        const h3Locator = this.page.locator('h3');

        await expect(h3Locator).toBeVisible({ timeout: 10000 });
        if (expectedText) {
            await expect(h3Locator).toHaveText(expectedText);
        }

    }
    async clickProjectInfoButton(projectName) {
        const infoButton = this.page.locator(`ul.company-list-ul:has(span.docName:text-is("${projectName}")) button:has-text("Info")`);
        await infoButton.click();
        await this.page.waitForTimeout(2000); // Wait for the info button to be clicked and the project info to load

    }
    async clickProjectLeftPanel(panelItem) {
        const commonPage = new CommonPage(this.page);
        const projectLeftPanelCustodian = this.page.locator('li.nav-item span.min-alt-text', { hasText: panelItem });
        await commonPage.waitForLoadingToFinish();
        await expect(projectLeftPanelCustodian).toBeVisible({ timeout: 10000 });
        const isVisible = await projectLeftPanelCustodian.isVisible();
        const isEnabled = await projectLeftPanelCustodian.isEnabled();
        console.log('Is custodian button visible?', isVisible, 'Is enabled?', isEnabled);
        //await projectLeftPanelCustodian.hover();
        //await projectLeftPanelCustodian.click();
        await this.page.waitForTimeout(2000); // Waits for 2 seconds
        await projectLeftPanelCustodian.click();
        console.log('Clicked Left Panel Custodian');

    }

    async createCustodianWithFirstNameLastName(firstName, lastName) {
        //await this.createCustodian.waitFor({ state: 'visible' });
        //console.log('Waiting for Create Custodian button to be visible...');
        //await this.createCustodian.click();
        const commonPage = new CommonPage(this.page);
        await commonPage.waitForLoadingToFinish();
        await this.custodianFirstName.click();
        await this.custodianFirstName.fill(firstName);
        await this.custodianLastName.click();
        await this.custodianLastName.fill(lastName);
        await this.page.getByRole('button', { name: 'Create' }).click();
        //using id custodianCreate-btn
        const toastMessage = getToastMessageLocator(this.page, `Custodian [${lastName}, ${firstName}] created successfully`);
        await expect(toastMessage).toBeVisible({ timeout: 40000 });


    }
    async clickOverviewPanel(panelItem) {
        const overviewPanel = this.page.locator(`li.nav-item span.min-alt-text:text-is("${panelItem}")`);
        await expect(overviewPanel).toBeVisible({ timeout: 10000 });
        const isVisible = await overviewPanel.isVisible();
        const isEnabled = await overviewPanel.isEnabled();
        console.log('Is Overview Panel visible?', isVisible, 'Is enabled?', isEnabled);
        await overviewPanel.click();
        console.log('Clicked Overview Panel', panelItem);
    }

    async clickSubPanel(subPanel) {
        const subPanelItem = this.page.locator(`ul.sub-analyze .sub-text:text-is("${subPanel}")`);
        await expect(subPanelItem).toBeVisible({ timeout: 10000 });
        const isVisible = await subPanelItem.isVisible();
        const isEnabled = await subPanelItem.isEnabled();
        console.log('Is subPanel visible?', isVisible, 'Is enabled?', isEnabled);
        await subPanelItem.click();
        console.log('Clicked subPanel', subPanelItem);
    }


    async inviteUser({ page, role, user, projectLabel, projectId }) {
        const commonPage = new CommonPage(page);
        const clientPage = new ClientPage(page);

        await this.accountMenu.click();
        await commonPage.navigateToProfileLink(page, 'Client Settings');
        await commonPage.waitForLoadingToFinish();
        await this.clickProjectLeftPanel('Manage Users');
        await page.waitForTimeout(5000);
        await expect(this.invite_button).toBeVisible({ timeout: 10000 });
        await this.invite_button.click();
        await page.waitForTimeout(2000);
        await this.verifyH3Displayed('Invite User');
        await expect(clientPage.selectInviteDropdown).toBeVisible({ timeout: 10000 });
        await clientPage.selectInviteDropdown.selectOption({ value: 'Default' });
        await page.waitForTimeout(500);
        await this.userFirstName.fill(user.firstName);
        await this.userLastName.fill(user.lastName);
        await this.userEmail.fill(user.email);
        await this.projectDropdown.click();
        await this.projectDropdown.selectOption({ label: projectLabel });
        await page.waitForTimeout(500);
        await expect(this.projectDropdown).toHaveValue(projectId);
        await this.roleDropdown.click();
        await this.roleDropdown.selectOption({ label: role });
        await expect(this.sendButton).toBeVisible({ timeout: 10000 });
        await this.sendButton.click();
        const toastMessage = getToastMessageLocator(page, `Invited user successfully.`);
        await expect(toastMessage).toBeVisible({ timeout: 40000 });
    }

   





}

module.exports = { CreateClientPage };
