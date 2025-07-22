
async function clickTabByName(page, tabName) {
    
    const tab = page.locator('li[role="tab"] span.k-link', { hasText: tabName });
    await tab.first().click();
}



async function highlightProgressBar(progressBarLocator) {
    await progressBarLocator.evaluate(el => {
        el.style.transition = 'background 0.3s, border 0.3s';
        el.style.background = 'yellow';
        el.style.border = '2px solid orange';
        setTimeout(() => {
            el.style.background = '';
            el.style.border = '';
        }, 800);
    });
}

async function waitForJobCompletion(page, jobName, jobType, waitMin = 10) {
    if (!jobName || !jobType) {
        throw new Error('Job name and type must be provided');
    }
   
    const start = Date.now();
    const timeoutMs = waitMin * 60 * 1000;
    let locateJobAttempt = 0;

    while (true) {
        // Click the refresh button
        await page.locator('.mts_refrash_btn').click();
        await page.waitForTimeout(1000);

        // Get all job rows
        const rows = await page.locator('tr.epiqTable__row').all();
        let found = false;

        for (const row of rows) {
            // Get all cells in the row and skip if not a valid job row
            const cells = await row.locator('td').all();
            if (cells.length < 8) continue; 

            // Extract job name and type
            const name = (await cells[1].locator('span').textContent()).trim();
            const type = (await cells[6].locator('span').textContent()).trim();

            if (name.includes(jobName) && type === jobType) {
                found = true;

                // Check for retry/failure icon
                const hasRetryIcon = await cells[8]?.locator('.qicon-retry, .qicon-refrash, .qicon-reply').first().isVisible().catch(() => false);
                if (hasRetryIcon) {
                    throw new Error(`ERROR: Job "${jobName}" "${jobType}" failed - RETRY icon was presented.`);
                }

                // Check progress
                const progressBar = cells[7].locator('.persatage-bar');
                await highlightProgressBar(progressBar);
                const progressText = await progressBar.textContent();
                if (progressText && progressText.includes('100%')) {
                    return; 
                }

                // Check for timeout
                if (Date.now() - start > timeoutMs) {
                    throw new Error(`Job "${jobName}" "${jobType}" did not complete in ${waitMin} minutes. Last progress: ${progressText}`);
                }

                await page.waitForTimeout(2000);
                break;
            }
        }

        if (!found) {
            locateJobAttempt++;
            if (locateJobAttempt > 2) {
                throw new Error(`Could not find a job with name "${jobName}" and type "${jobType}" after several retries.`);
            }
            await page.waitForTimeout(2000);
        }
    }
}
module.exports = { waitForJobCompletion, highlightProgressBar, clickTabByName };