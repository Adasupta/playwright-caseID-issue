const { test, expect } = require('@playwright/test');
const { getToken, create_custodian, createProject, deleteProject } = require('../functions/initialize');
const { LoginPage } = require('../functions/login')
const { CommonPage } = require('../functions/utilities');
const { CreateClientPage } = require('../functions/project');
const { CollectionPage } = require('../functions/collection');
const { ProcessPage } = require('../functions/process');
const { FilterPage } = require('../functions/filter');
const { getToastMessageLocator } = require('../functions/utilities');
const { waitForJobCompletion, highlightProgressBar, clickTabByName } = require('../functions/jobOverview');
require('dotenv').config();

let API_Token;
let projectId;
let projectName;
let custodianId1;
let custodianId2;
let custodianId3;
let projectInfo;

test.beforeAll(async ({ }) => {
    API_Token = await getToken();
    console.log('API Token:', API_Token);

    const project_name = CommonPage.generateName('SmokeDeployQA');

    projectInfo = await createProject(project_name, API_Token);
    console.log('Project ID:', projectId);
    projectId = projectInfo.projectId;
    projectName = projectInfo.projectName;
    console.log('Project Name:', projectInfo.projectName);
    console.log('Creating custodians for the project:', projectId);
    custodianId1 = await create_custodian('Best', 'Trevor', projectId, API_Token);
    custodianId2 = await create_custodian('Susan', 'Anthony', projectId, API_Token);
    custodianId3 = await create_custodian('Rice', 'Jerry', projectId, API_Token);
});


// In a Playwright test file
test('A_305074_Non_Chained_Collection_Local_Processing_till_Production', async ({ page }) => {
    const caseId = 'TC305074';
    const loginPage = new LoginPage(page)
    await loginPage.navigate(process.env.BASE_URL);
    // Wait until the page is fully loaded
    await page.waitForLoadState('load');
    const h1Text = await page.locator('h1').textContent();
    expect(h1Text).toContain('Log In');
    await page.waitForTimeout(10000);
    await loginPage.login(process.env.CLIENTADMIN_USERNAME, process.env.CLIENTADMIN_PASSWORD)
    await page.waitForTimeout(9000);
    const commonPage = new CommonPage(page);
    await commonPage.searchEntity(projectName, 'Project');
    const projectNameLocator = page.locator('ul.company-list-ul span.docName', { hasText: projectName });
    await projectNameLocator.click();
    await page.waitForTimeout(2000);
    let panelItem = 'Collect';
    const projectPage = new CreateClientPage(page);
    await projectPage.clickOverviewPanel(panelItem);
    const collectionPage = new CollectionPage(page);
    await collectionPage.localBox.waitFor({ state: 'visible' });
    await collectionPage.localBox.click();
    await collectionPage.unchainedCollectionJob(
        caseId,
        'Personal Computer',
        'Trevor, Best'
    );
    await page.waitForTimeout(2000);
    await collectionPage.collectDir('smoke', caseId, collectionPage.fileInput);
    await collectionPage.submitButton.click();
    await page.waitForTimeout(1000);
    await clickTabByName(page, 'Jobs Overview');
    await waitForJobCompletion(page, caseId, 'Collect', 10);
    const processPage = new ProcessPage(page);
    panelItem = 'Process';
    await projectPage.clickOverviewPanel(panelItem);
    await page.waitForTimeout(2000);
    await processPage.checkboxByName(caseId).check();
    await processPage.nextButton.isVisible();
    await expect(processPage.nextButton).toBeVisible({ timeout: 10000 });
    await expect(processPage.nextButton).toBeEnabled();
    await processPage.nextButton.click();
    // Wait for the dialog to appear (optional, but recommended)
    await page.getByRole('button', { name: 'Submit' }).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(1000);
    await waitForJobCompletion(page, caseId, 'Process', 10);
    await waitForJobCompletion(page, caseId, 'Deduplication', 10);
    await waitForJobCompletion(page, caseId, 'Post Processing', 10);
    panelItem = 'Analyze';
    await projectPage.clickOverviewPanel(panelItem);
    await page.waitForTimeout(2000);
    let subPanelItem = 'Filter';
    await projectPage.clickSubPanel(subPanelItem);
    await page.waitForTimeout(20000);
    const filterPage = new FilterPage(page);
    await filterPage.selectTemplateDropdownValue('Create New');
    await page.waitForTimeout(2000);
    await filterPage.filterJobName.waitFor({ state: 'visible' });
    await filterPage.filterJobName.click();
    await filterPage.filterJobName.fill(caseId);
    await filterPage.selectDataNameButton.scrollIntoViewIfNeeded();
    await filterPage.selectDataNameButton.waitFor({ state: 'visible' });
    await filterPage.selectDataNameButton.click();
    await filterPage.filterDataName.click();
    await filterPage.filterDataName.fill(caseId);

    await filterPage.clickDataNameCheckbox(caseId);
    //await filterPage.filterDataName.click();
    await page.waitForTimeout(5000);
    await filterPage.selectStartAutomaticallyOption('Promote');
    await page.waitForTimeout(5000);
    await filterPage.saveButton.click();
    const filterTempName = CommonPage.generateName(caseId);
    await page.waitForTimeout(5000);
    await projectPage.verifyH3Displayed('Create New Template');
    await filterPage.filterTempNameTextbox.waitFor({ state: 'visible' });
    await filterPage.filterTempNameTextbox.click();
    await filterPage.filterTempNameTextbox.fill(filterTempName);
    await expect(filterPage.createButton).toBeVisible({ timeout: 2000 });
    await expect(filterPage.createButton).toBeEnabled({ timeout: 2000 });
    await filterPage.createButton.click();
    console.log(`Filter Template [${filterTempName}] created successfully`);
    const toastMessage = getToastMessageLocator(page, `Filter Template [${filterTempName}] created successfully`);
    await expect(toastMessage).toBeVisible({ timeout: 40000 });
    await page.waitForTimeout(5000);
    await filterPage.runButton.click();
    await page.waitForTimeout(1000);
    await waitForJobCompletion(page, caseId, 'Filter', 10);
    await waitForJobCompletion(page, caseId, 'Promotion', 10);
    await waitForJobCompletion(page, caseId, 'Near Dupe and Threading', 10);


});
test.afterAll(async ({ request }, testInfo) => {
    // Only delete the project if all tests passed
    if (testInfo.status === 'passed') {
        console.log('Cleaning up after tests...');
        await deleteProject(projectId, API_Token);
    } else {
        console.log('Test did not complete successfully. Project will NOT be deleted.');
    }
});

