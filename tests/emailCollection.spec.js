require('dotenv').config();

const { test, expect } = require('@playwright/test');

test.describe('Email Collection - IMAP - Gmail' , () => {
    test.skip('Verify that "Next" button without selecting a protocol', async ({ page }) => {
    });
    test.skip('Verify that the "Next" button with selecting a protocol', async ({ page }) => {
    });
    test.skip('Verify thae "Next" button without selecting a mail server', async ({ page }) => {
    });
    test.skip('Verify that the "Next" button with selecting a mail server Gmail', async ({ page }) => {
    });
    test.skip('Verify that the "Authentication Type" field is visible and set to "Basic" for Gmail mail server', async ({ page }) => {
    });
    test.skip('Verify thae "Next" button without filling email and password', async ({ page }) => {
    });
    test.skip('Verify that the "Next" button with filling email and password', async ({ page }) => {
    });
    test.skip('Verify that the "Next" button with filling email and password with invalid credentials', async ({ page }) => {
    });
});

test.describe('Email Collection - IMAP - Yahoo', () => {
   
    test.skip('Verify that the "Next" button with selecting a mail server as Yahoo', async ({ page }) => {
    });
   
    test.skip('Verify thae "Next" button without filling email and password', async ({ page }) => {
    });
    test.skip('Verify that the "Next" button with filling email and password', async ({ page }) => {
    });
    test.skip('Verify that the "Next" button with filling email and password with invalid credentials', async ({ page }) => {
    });
});

test.describe('Email Collection - IMAP - Office 365', () => {

    test.skip('Verify that the "Next" button with selecting a mail server as Office 365', async ({ page }) => {
    });
    test.skip('Verify that the "Authentication Type" field is visible and set to "OAuth" for Office 365 mail server', async ({ page }) => {
    });
    test.skip('verify all fields and their default values', async ({ page }) => {
    });
    test.skip('Click "Submit" with all fields empty or at default.', async ({ page }) => {
    });
    test.skip('Click "Submit" with all fields filled with valid data', async ({ page }) => {
    });
    test.skip('Verify date fields', async ({ page }) => {
    });
    test.skip('Verify all drop downs', async ({ page }) => {
    });
    test.skip('Verify Submit and Back Buttons', async ({ page }) => {
    });
});

test.describe('Email Collection - IMAP - IMAP Server', () => {
    test.skip('Verify that the "Next" button with selecting a mail server as IMAP Server', async ({ page }) => {
    });
   
    test.skip('verify all fields and their default values', async ({ page }) => {
    });
    test.skip('Click "Next" with all fields empty or at default.', async ({ page }) => {
    });
    test.skip('Click "Next" with all fields filled with valid data', async ({ page }) => {
    });
    
});

test.describe(' Email Collection - IMAP - EWS', () => {

});