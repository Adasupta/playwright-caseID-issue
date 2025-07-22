const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../functions/login');
const { CommonPage } = require('../functions/utilities');
require('dotenv').config();

test('Login to Epiq  correct credentials', async ({ page, context }) => {
    console.log('BASE_URL:', process.env.BASE_URL);
    context.clearCookies();
    console.log('Starting correct credentials login test');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(process.env.BASE_URL);
    const h1Text = await page.locator('h1').textContent();
    console.log('Login page loaded, h1:', h1Text);
    expect(h1Text).toContain('Log In');
    await loginPage.login(process.env.CLIENTADMIN_USERNAME, process.env.CLIENTADMIN_PASSWORD);
    await page.waitForTimeout(5000);
    console.log('Login attempted, checking for logo');
    await expect(loginPage.loginLogo).toBeVisible();
    console.log('Test passed: loginLogo is visible');

});

test('Login to Epiq  wrong username name', async ({ page, context }) => {
    console.log('BASE_URL:', process.env.BASE_URL);

    context.clearCookies();
    console.log('Starting wrong username login test');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(process.env.BASE_URL);
    const h1Text = await page.locator('h1').textContent();
    console.log('Login page loaded, h1:', h1Text);
    expect(h1Text).toContain('Log In');
    await loginPage.login(process.env.wrongusername, process.env.CLIENTADMIN_PASSWORD);
    await page.waitForTimeout(5000);
    console.log('Login attempted with wrong username, checking for error message');
    await expect(loginPage.loginErrMessage).toBeVisible();
    console.log('Test passed: loginErrMessage is visible');
});

test('Logout from Epiq system', async ({ page, context }) => { 
    console.log('BASE_URL:', process.env.BASE_URL);

    context.clearCookies();
    console.log('Starting wrong username login test');
    const loginPage = new LoginPage(page);
    await loginPage.navigate(process.env.BASE_URL);
    const h1Text = await page.locator('h1').textContent();
    console.log('Login page loaded, h1:', h1Text);
    expect(h1Text).toContain('Log In');

  
    await loginPage.login(process.env.CLIENTADMIN_USERNAME, process.env.CLIENTADMIN_PASSWORD);
    //await loginPage.login(process.env.CLIENTADMIN_USERNAME, process.env.CLIENTADMIN_PASSWORD);
    await page.waitForTimeout(5000);
    console.log('Login attempted, checking for logo');
    await expect(loginPage.loginLogo).toBeVisible();

    const commonPage = new CommonPage(page);
    await commonPage.navigateToProfileLink(page, 'Client');
    await commonPage.navigateToProfileLink(page, 'Logout');
    await page.waitForTimeout(2000);
    const promptParagraph = page.getByText('Are you sure you want to logout?', { exact: true });
    await expect(promptParagraph).toBeVisible({ timeout: 10000 });
    await commonPage.handleSystemPrompt('confirm');
    expect(h1Text).toContain('Log In');

});
