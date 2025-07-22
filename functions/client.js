const { expect } = require('@playwright/test');
const { CommonPage } = require('../functions/utilities');
const { getToastMessageLocator } = require('../functions/utilities');

class ClientPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        this.createNewClientButton = page.getByRole('button', { name: '' });
        this.clientNameInput = page.getByRole('textbox', { name: 'Client Name' });
        this.filterClientInput = page.getByRole('searchbox', { name: 'Filter Client' });
        this.searchAnimatorDiv = page.locator('div.search-animator');
        this.searchIcon = page.locator('i.qicon-search');
        this.allClients = page.getByRole('link', { name: 'All Clients' });
        this.allClientJobs = page.getByRole('link', { name: 'All Client Jobs' });
        this.systemDashboard = page.getByRole('link', { name: 'System Dashboard' });
        this.queuedJobs = page.getByRole('link', { name: 'Queued Jobs' });
        this.systemAdmins = page.getByRole('link', { name: 'System Admins' });
        this.epiqAdmins = page.getByRole('link', { name: 'Epiq Admins' });
        this.disposition = page.getByRole('link', { name: 'Disposition' });
        this.getAssistance = page.getByRole('button', { name: 'Get Assistance' });
        this.allClientJobs_Client = page.locator('span.whitespace-nowrap', { hasText: 'Client' });
        this.allClientJobs_ProjectName = page.locator('span.whitespace-nowrap', { hasText: 'Project Name' });
        this.allClientJobs_JobName = page.locator('span.whitespace-nowrap', { hasText: 'Job Name' });
        this.allClientJobs_Custodian = page.locator('span.whitespace-nowrap', { hasText: 'Custodian' });
        this.allClientJobs_Source = page.locator('span.whitespace-nowrap', { hasText: 'Source' });
        this.allClientJobs_SubmittedBy = page.locator('span.whitespace-nowrap', { hasText: 'Submitted By' });
        this.allClientJobs_SubmittedDate = page.locator('span.whitespace-nowrap', { hasText: 'Submitted Date' });
        this.allClientJobs_JobType = page.locator('span.whitespace-nowrap', { hasText: 'Job Type' });
        this.allClientJobs_JobStatus = page.locator('span.whitespace-nowrap', { hasText: 'Job Status' });
        this.inviteUser_SystemAdmin = page.locator('button', { hasText: 'Invite' });
        this.selectInviteDropdown = page.locator('select[name="loginMethod"]');
        this.inviteUserEmail = page.locator('textarea[name="userEmail"]');
        this.inviteSubmitButton = page.locator('button[type="submit"]', { hasText: 'Invite' });
        this.systemAdminsListText = page.getByText('System Admin List', { exact: true });
        this.epiqAdminsListText = page.getByText('Epiq Admin List', { exact: true });
        this.selectDispositionDropdown = page.locator('select[name="companyId"]');
        this.submitDispostion = page.locator('button[type="submit"]', { hasText: 'Delete' });
        this.project = page.getByRole('link', { name: 'Projects' });
        this.clientInfoButton = page.locator('a[href="/project/ClientSetting"] >> button', { hasText: 'Info' });
        this.client_Name = page.locator('#clientName');
        this.client_streetAddress = page.locator('textarea[placeholder="Address"]');
        this.client_city = page.locator('#city');
        this.client_state = page.locator('#state');
        this.client_postalCode = page.locator('#postalCode');
        this.client_country = page.locator('select[name="country"] option:checked');
        this.client_phone = page.locator('input[name="phoneNumber"]');
        this.client_enableClientBilling = page.locator('input[name="clientBilling"]');
        this.client_enablePrivilegeDetector = page.locator('input[name="privilegeDetector"]');
        this.client_useSharedDatabase = page.locator('input[name="sharedDatabase"]');
        this.client_aiTextSummarization = page.locator('input[name="textSummarization"]');
        this.client_msTeamsAttachments = page.locator('input[name="microsoftTeams"]');
        this.client_predictiveCoding = page.locator('input[name="predictiveCoding"]');
        this.client_translation = page.locator('input[name="translation"]');
        this.client_transcription = page.locator('input[name="transcription"]');
        this.client_aiModel = page.locator('input[name="qaCopilot"]');
        this.sysAdmin_Invite_Cancel = page.getByRole('button', { name: 'Cancel' });

    }

    async createClient(page, formData) {
        let clientName = null;
        const clientPage = new ClientPage(page);

        for (const field of formData.fields) {
            switch (field.type) {
                case 'dropdown':
                    if (field.label === 'Country') {
                        const countryValue = field.options[0];
                        const countrySelect = page.locator('select[name="country"]');
                        await countrySelect.click();
                        await page.selectOption('select[name="country"]', { label: countryValue });
                    } else if (field.label === 'Country Flag') {
                        const selectedCountryObj = field.countryCodes[0];
                        const countryName = selectedCountryObj.country;
                        const flagClass = selectedCountryObj.flag;
                        await page.locator('.selected-flag').click();
                        const flagLocator = page.locator(`ul.country-list li:has(.country-name:text-is("${countryName}")) .iti-flag.${flagClass}`).first();
                        await flagLocator.scrollIntoViewIfNeeded();
                        await flagLocator.click();
                    }
                    break;
                case 'checkbox':
                    const checkbox = page.locator(`label:text-is("${field.label}")`).locator('xpath=following::input[@type="checkbox"][1]');
                    if (field.checked === false) {
                        await checkbox.uncheck();
                    } else {
                        await checkbox.check();
                    }
                    break;
                default:
                    if (!('value' in field) || field.value === null || field.value === '') {
                        continue;
                    }
                    if (field.label === 'Name') {

                        //const commonPage = new CommonPage(page);
                        clientName = CommonPage.generateName(field.value);
                        await clientPage.clientNameInput.click();
                        await clientPage.clientNameInput.fill(clientName);

                    } else if (field.label === 'Address') {
                        const addressInput = page.locator(`textarea[placeholder="${field.label}"]`);
                        await addressInput.click();
                        await addressInput.fill(field.value);
                    } else if (field.label === 'Phone Number') {
                        const phoneInput = page.locator(`input[name="phoneNumber"]`);
                        await phoneInput.click();
                        await phoneInput.fill(field.value);
                    } else {
                        const input = page.locator(`input[placeholder="${field.label}"]`);
                        await input.click();
                        await input.fill(field.value);
                    }
            }
        }
        return clientName;
    }

    async createClientAndReturnName(page, formData) {
        const clientPage = new ClientPage(page);
        await clientPage.createNewClientButton.click();
        const clientName = await clientPage.createClient(page, formData);
        const createClientButton = page.getByRole('button', { name: 'Create Client' });
        await createClientButton.click();
        const toastMessage = getToastMessageLocator(page, `New Client Created Successfully`);
        await expect(toastMessage).toBeVisible({ timeout: 40000 });
        await expect(toastMessage).toBeHidden({ timeout: 10000 });
        return clientName;
    }

    async filterAllClientJobs({
        client,
        projectName,
        jobName,
        custodian,
        source,
        submittedBy,
        submittedDate,
        jobType,
        jobStatus
    } = {}) {
        console.log('Filtering All Client Jobs with:', {
            client, projectName, jobName, custodian, source, submittedBy, submittedDate, jobType, jobStatus
        });
        const utility = new CommonPage(this.page);

        if (client) {
            const button = this.page.locator('button[data-testid="button-clientNameFilter"]');
            await expect(button).toBeVisible({ timeout: 20000 });
            await expect(button).toBeEnabled({ timeout: 20000 });
            await button.click();
            await this.page.locator('input[id="multi-select-inputclientNameFilter"]').fill(client);
            await this.page.locator(`a[data-testid^="link-clientNameFilter-"] span[title="${client}"]`).click();
            await utility.waitForLoadingToFinish();
        }

        if (projectName) {
            await expect(this.allClientJobs_ProjectName).toBeVisible({ timeout: 10000 });
            const button = this.page.locator('button[data-testid="button-projectNameFilter"]');
            await expect(button).toBeEnabled({ timeout: 20000 });
            await button.click();
            await this.page.locator('input[id="multi-select-inputprojectNameFilter"]').fill(projectName);
            await this.page.locator(`a[data-testid^="link-projectNameFilter-"] span[title="${projectName}"]`).click();
            await utility.waitForLoadingToFinish();
        }

        if (jobName) {
            await expect(this.allClientJobs_JobName).toBeVisible({ timeout: 10000 });
            const button = this.page.locator('button[data-testid="button-jobNameFilter"]');
            await expect(button).toBeEnabled({ timeout: 20000 });
            await button.click();
            await this.page.locator('input[id="multi-select-inputjobNameFilter"]').fill(jobName);
            await this.page.locator(`a[data-testid^="link-jobNameFilter-"] span[title="${jobName}"]`).click();
            await utility.waitForLoadingToFinish();
        }

        if (custodian) {
            await expect(this.allClientJobs_Custodian).toBeVisible({ timeout: 10000 });
            const button = this.page.locator('button[data-testid="button-custodianNameFilter"]');
            await expect(button).toBeEnabled({ timeout: 20000 });
            await button.click();
            await this.page.locator('input[id="multi-select-inputcustodianNameFilter"]').fill(custodian);
            await this.page.locator(`a[data-testid^="link-custodianNameFilter-"] span[title="${custodian}"]`).click();
            await utility.waitForLoadingToFinish();
        }

        if (source) {
            await expect(this.allClientJobs_Source).toBeVisible({ timeout: 10000 });
            const button = this.page.locator('button[data-testid="button-sourceNameFilter"]');
            await expect(button).toBeEnabled({ timeout: 20000 });
            await button.click();
            await this.page.locator('input[id="multi-select-inputsourceNameFilter"]').fill(source);
            await this.page.locator(`a[data-testid^="link-sourceNameFilter-"] span[title="${source}"]`).click();
            await utility.waitForLoadingToFinish();
        }

        if (submittedBy) {
            await expect(this.allClientJobs_SubmittedBy).toBeVisible({ timeout: 10000 });
            const button = this.page.locator('button[data-testid="button-submittedByFilter"]');
            await expect(button).toBeEnabled({ timeout: 20000 });
            await button.click();
            await this.page.locator('input[id="multi-select-inputsubmittedByFilter"]').fill(submittedBy);
            await this.page.locator(`a[data-testid^="link-submittedByFilter-"] span[title="${submittedBy}"]`).click();
            await utility.waitForLoadingToFinish();
        }

        if (submittedDate) {
            await expect(this.allClientJobs_SubmittedDate).toBeVisible({ timeout: 10000 });
            const button = this.page.locator('button[data-testid="searchable-dropdown-button"]');
            await expect(button).toBeVisible({ timeout: 20000 });
            await expect(button).toBeEnabled({ timeout: 20000 });
            await button.click();
            await this.page.waitForSelector('div#submittedDateFilter', { state: 'visible', timeout: 5000 });
            const option = this.page.locator(`div#submittedDateFilter a[title="${submittedDate}"]`);
            await expect(option).toBeVisible({ timeout: 5000 });
            await option.click();
            await utility.waitForLoadingToFinish();
        }

        if (jobType) {
            await expect(this.allClientJobs_JobType).toBeVisible({ timeout: 10000 });
            const button = this.page.locator('button[data-testid="button-jobTypeFilter"]');
            await expect(button).toBeEnabled({ timeout: 20000 });
            await button.click();
            await this.page.locator('input[id="multi-select-inputjobTypeFilter"]').fill(jobType);
            await this.page.locator(`a[data-testid^="link-jobTypeFilter-"] span[title="${jobType}"]`).click();
            await utility.waitForLoadingToFinish();
        }

        if (jobStatus) {
            await utility.waitForLoadingToFinish();
            await expect(this.allClientJobs_JobStatus).toBeVisible({ timeout: 10000 });
            const button = this.page.locator('button[data-testid="button-jobStatusIdFilter"]');
            await expect(button).toBeVisible({ timeout: 20000 });
            await expect(button).toBeEnabled({ timeout: 20000 });
            await button.click();
            await this.page.waitForSelector('div#jobStatusIdFilter', { state: 'visible', timeout: 5000 });
            await this.page.locator(`div#jobStatusIdFilter span[title="${jobStatus}"]`).click();
            await utility.waitForLoadingToFinish();
        }
    }

    async deleteClient(clientName) {
        const utility = new CommonPage(this.page);
        await expect(this.allClients).toBeVisible({ timeout: 10000 });
        await utility.highlightAndClick(this.disposition);
        await utility.waitForLoadingToFinish();

        //select client name from dropdown
        await this.selectDispositionDropdown.click();
        await this.selectDispositionDropdown.selectOption({ label: clientName });
        await expect(this.submitDispostion).toBeVisible({ timeout: 10000 });
        await expect(this.submitDispostion).toBeEnabled({ timeout: 10000 });
        await this.submitDispostion.click();

        const confirmDeleteDialog = this.page.locator('.swal2-popup.dispoPopup[role="dialog"]');
        await expect(confirmDeleteDialog).toBeVisible({ timeout: 10000 });

        //Title
        const title = confirmDeleteDialog.locator('#DispositionHead');
        await expect(title).toHaveText('Delete Client');

        // Body text
        const deleteBodyText = confirmDeleteDialog.locator('#dispositionP');
        await expect(deleteBodyText).toHaveText('Confirm that you want to permanently delete this Client, which includes all users associated with it. ');
        await this.page.waitForTimeout(5000);
        const deleteButton = this.page.getByRole('button', { name: 'Delete' });
        await expect(deleteButton).toBeVisible({ timeout: 10000 });
        await expect(deleteButton).toBeEnabled({ timeout: 10000 });
        const cancelButton = this.page.getByRole('button', { name: 'Cancel' });
        await expect(cancelButton).toBeVisible({ timeout: 10000 });
        await expect(cancelButton).toBeEnabled({ timeout: 10000 });

        // 3. Click the delete button
        await deleteButton.click();

        // 4. Wait for the toast message to appear
        const toastMessageDelete = getToastMessageLocator(this.page, `Deleted client successfully`);
        await expect(toastMessageDelete).toBeVisible({ timeout: 40000 });
        await this.page.waitForTimeout(5000);
    }
    async getClientInfo(clientName) {
        if (clientName) {

            // Navigate to the client info page for the given client name
            const commonPage = new CommonPage(this.page);
            await commonPage.waitForLoadingToFinish();
            await this.page.waitForTimeout(10000);
            await commonPage.searchEntity(clientName, 'Client');
            const infoButton = this.page.locator(`ul.company-list-ul:has(span.docName:text-is("${clientName}")) button:has-text("Info")`);
            await this.page.waitForTimeout(1000);
            await infoButton.click();
            await this.page.waitForTimeout(10000);
        }
        // Collect all field values
        const Name = this.client_Name.inputValue();
        const streetAddress = this.client_streetAddress.inputValue();
        const city = this.client_city.inputValue();
        const state = this.client_state.inputValue();
        const postalCode = this.client_postalCode.inputValue();
        const country = this.client_country.textContent();
        const phone = this.client_phone.inputValue();
        const enableClientBilling = this.client_enableClientBilling.isChecked();
        const enablePrivilegeDetector = this.client_enablePrivilegeDetector.isChecked();
        const useSharedDatabase = this.client_useSharedDatabase.isChecked();
        const aiTextSummarization = this.client_aiTextSummarization.isChecked();
        const msTeamsAttachments = this.client_msTeamsAttachments.isChecked();
        const predictiveCoding = this.client_predictiveCoding.isChecked();
        const translation = this.client_translation.isChecked();
        const transcription = this.client_transcription.isChecked();
        const aiModel = this.client_aiModel.isChecked();

        return {
            Name,
            streetAddress,
            city,
            state,
            postalCode,
            country,
            phone,
            enableClientBilling,
            enablePrivilegeDetector,
            useSharedDatabase,
            aiTextSummarization,
            msTeamsAttachments,
            predictiveCoding,
            translation,
            transcription,
            aiModel
        };
    }
    async updateClientInfo(clientName,
        { name,
            streetAdress,
            city,
            state,
            postalCode,
            country,
            phone,
            clientBilling,
            privilegeDetector,
            sharedDatabase,
            aiTextSummarization,
            msTeamsAttachments,
            predictiveCoding,
            translation,
            transcription,
            aiModel } = {}
    ) {
        if (clientName) {

            console.log(`Updating client info for: ${clientName}`);
            await this.page.waitForTimeout(10000);
        }

        // Update fields with new values
        if (name) {

            await this.client_Name.fill(''); // Clear existing data
            await this.client_Name.fill(name);


        }
        if (streetAdress) {
            await this.client_streetAddress.fill(''); // Clear existing data
            await this.client_streetAddress.fill(streetAdress);
        }
        if (city) {
            await this.client_city.fill(''); // Clear existing data
            await this.client_city.fill(city);
        }
        if (state) {
            await this.client_state.fill(''); // Clear existing data
            await this.client_state.fill(state);
        }
        if (postalCode) {
            await this.client_postalCode.fill(''); // Clear existing data
            await this.client_postalCode.fill(postalCode);
        }
        if (country) {
            //await this.client_country.selectOption({ label: country });
            const countrySelect = this.page.locator('select[name="country"]');
            await countrySelect.click();
            await this.page.selectOption('select[name="country"]', { label: country });
        }
        if (phone) {
            await this.client_phone.fill(''); // Clear existing data
            await this.client_phone.fill(phone);
        }
        if (clientBilling !== undefined) {
            if (clientBilling) {
                await this.client_enableClientBilling.check();
            } else {
                await this.client_enableClientBilling.uncheck();
            }
        }
        if (privilegeDetector !== undefined) {
            if (privilegeDetector) {
                await this.client_enablePrivilegeDetector.check();
            } else {
                await this.client_enablePrivilegeDetector.uncheck();
            }
        }
        if (sharedDatabase !== undefined) {
            if (sharedDatabase) {
                await this.client_useSharedDatabase.check();
            } else {
                await this.client_useSharedDatabase.uncheck();
            }
        }
        if (aiTextSummarization !== undefined) {
            if (aiTextSummarization) {
                await this.client_aiTextSummarization.check();
            } else {
                await this.client_aiTextSummarization.uncheck();
            }
        }
        if (msTeamsAttachments !== undefined) {
            if (msTeamsAttachments) {
                await this.client_msTeamsAttachments.check();
            } else {
                await this.client_msTeamsAttachments.uncheck();
            }
        }
        if (predictiveCoding !== undefined) {
            if (predictiveCoding) {
                await this.client_predictiveCoding.check();
            } else {
                await this.client_predictiveCoding.uncheck();
            }
        }
        if (translation !== undefined) {
            if (translation) {
                await this.client_translation.check();
            } else {
                await this.client_translation.uncheck();
            }
        }
        if (transcription !== undefined) {
            if (transcription) {
                await this.client_transcription.check();
            }
            else {
                await this.client_transcription.uncheck();
            }
        }
        if (aiModel !== undefined) {
            if (aiModel) {
                await this.client_aiModel.check();
            } else {
                await this.client_aiModel.uncheck();
            }
        }

        const saveButton = this.page.getByText('Save', { exact: true });
        const utility = new CommonPage(this.page);
        await utility.highlightAndClick(saveButton);
        const toastMessage = getToastMessageLocator(this.page, `Company info saved Successfully.`);
        await expect(toastMessage).toBeVisible({ timeout: 40000 });
        await expect(toastMessage).toBeHidden({ timeout: 10000 });

    }

    // Add this method to your ClientPage class

    async sortClientsByName(order = 'asc') {
        // Click the sort button for the client name column
        const sortButton = this.page.locator('li').filter({ hasText: 'Client Names' });
        const clientNamesHeaderLi = this.page.locator('li[role="none"] span[data-testid="header-Client Names"]').locator('..');
        // Get current sort direction
        // Function to get sort direction from the class attribute
        async function getSortDirectionFromLi() {
            const classAttr = await clientNamesHeaderLi.getAttribute('class');
            if (classAttr.includes('desc')) return 'descending';
            if (classAttr.includes('asc')) return 'ascending';
            return 'none';
        };
        let currentSort = await getSortDirectionFromLi();
        // If not sorted or not in desired order, click until it is
        let desiredSort = order === 'asc' ? 'ascending' : 'descending';
        let attempts = 0;
        while (currentSort !== desiredSort && attempts < 3) {
            await clientNamesHeaderLi.click();
            await this.page.waitForTimeout(500); // wait for UI update
            currentSort = await getSortDirectionFromLi();
            attempts++;
        }
    }
    
    async getSortedClientNames() {
        // selector to client name list items
        const clientNameLocators = this.page.locator('ul.company-list-ul span.docName');
        const count = await clientNameLocators.count();
        const names = [];
        for (let i = 0; i < count; i++) {
            names.push(await clientNameLocators.nth(i).textContent());
        }
        // Remove null/undefined and trim whitespace
        return names.filter(Boolean).map(n => n.trim());
    }

    async systemAdminInviteDialog() {
        const utility = new CommonPage(this.page);
        await expect(this.allClients).toBeVisible({ timeout: 10000 });
        await utility.highlightAndClick(this.systemAdmins);
        await utility.highlightAndClick(this.inviteUser_SystemAdmin);
        await expect(this.page.getByRole('heading', { name: 'Invite System Admins' })).toBeVisible();
        console.log('System Admin Invite dialog is visible');
        await expect(this.page.getByText('Login Method', { exact: true })).toBeVisible({ timeout: 10000 });
        console.log('Login Method dropdown is visible');
        await expect(this.page.getByText('Admins Email addresses')).toBeVisible({ timeout: 10000 });

        await expect(this.page.getByText('(Epiq domain emails only; separated by semicolons)')).toBeVisible({ timeout: 10000 });
        console.log('Email input is visible');
        await expect(this.page.getByRole('button', { name: 'Invite', exact: true })).toBeVisible({ timeout: 10000 });
        await expect(this.page.getByRole('button', { name: 'Cancel' })).toBeVisible();
        console.log('Invite and Cancel buttons are visible');
        await expect(this.page.locator('select[name="loginMethod"]')).toBeVisible();
        await expect(this.page.locator('textarea[name="userEmail"]')).toBeVisible();
        console.log('Login Method dropdown and Email input are visible');
    }

}
async function inviteEpiqandSystemAdminAndAssert(page, email, valid) {
    const clientPage = new ClientPage(page);
    const utility = new CommonPage(page);
    await expect(clientPage.inviteUser_SystemAdmin).toBeVisible({ timeout: 10000 });
    await clientPage.inviteUser_SystemAdmin.click();
    await expect(clientPage.selectInviteDropdown).toBeVisible({ timeout: 10000 });
    await clientPage.selectInviteDropdown.selectOption({ value: 'Default' });
    await expect(clientPage.inviteUserEmail).toBeVisible({ timeout: 10000 });
    await clientPage.inviteUserEmail.fill(email);
    await page.waitForTimeout(500);
    await expect(clientPage.inviteSubmitButton).toBeVisible({ timeout: 10000 });
    await clientPage.inviteSubmitButton.click();

    if (valid) {
        await page.waitForSelector('.ani-alertpageLoading', { state: 'hidden', timeout: 20000 });
        const toastMessage = getToastMessageLocator(page, `Invited user successfully.`);
        await expect(toastMessage).toBeVisible({ timeout: 40000 });
        await expect(toastMessage).toBeHidden({ timeout: 10000 });
    } else {
        await expect(page.getByText(`${email} is not a valid Epiq email.`)).toBeVisible({ timeout: 5000 });
    }
}


module.exports = { ClientPage, inviteEpiqandSystemAdminAndAssert };