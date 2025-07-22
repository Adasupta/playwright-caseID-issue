const { expect } = require('@playwright/test');
// loginPage.js

class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator('#email_auth');
        this.passwordInput = page.locator('#password_auth');
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.loginButton = page.getByRole('button', { name: 'Log In' });
        this.createProjectButton = page.locator('[title="Create New Project"]');
        this.projectNameInput = page.locator('[name="projectName"]');
        this.projectDescInput = page.locator('[name="projectDescription"]');
        this.loginErrMessage = page.locator('p', { hasText: 'Invalid code, try again' })
        this.loginLogo = page.locator('[class="large-logo"]');
        this.logoutConfirm = page.locator('.logoutConfirm-btn');
        this.accountMenu = page.locator('a p[title="Account Menu"]');
        this.logoutLink = page.getByRole('link', { name: 'Logout', exact: true });
        this.classicSwitch = page.locator('.classicModelSwitch');
        this.newEpiqDiscovery = page.locator('.tryNewDiscovery');

    }

    async navigate(urlname) {
        await this.page.goto(urlname);
        console.log(this.page.url())
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.nextButton.click();
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        //await this.loginLogo.waitFor({ state: 'visible' });
        console.log("logged in")
        await this.page.waitForTimeout(8000);
        //code to switch between classic to React
        if (await this.classicSwitch.isVisible({ timeout: 2000 })) {
            await this.classicSwitch.click();
            await this.newEpiqDiscovery.click();
            console.log('Clicked the classicModelSwitch icon.');
        } else {
            console.log('React app.');
        }
    }

    async logout() {
        await this.accountMenu.click();
        await this.logoutLink.click();
        await this.page.waitForTimeout(2000);
        const promptParagraph = this.page.getByText('Are you sure you want to logout?', { exact: true });
        await expect(promptParagraph).toBeVisible({ timeout: 10000 });
        await this.logoutConfirm.click();
        await this.page.waitForTimeout(500);
        await expect(this.page.locator('h1')).toHaveText(/Log In/);
    }
    // async createProject(name, description) {
    //   await this.createProjectButton.click();
    //   await this.projectNameInput.fill(name);
    //   await this.projectDescInput.fill(description);
    // }
}

module.exports = { LoginPage };
