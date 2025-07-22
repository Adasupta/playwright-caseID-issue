process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// @ts-nocheck
import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';


const testEnv = process.env.TEST_ENV || 'QA';
const envFile = path.resolve(process.cwd(), `.env.${testEnv}`);
let nodeEnv = testEnv;
if (testEnv !== 'qa' && !fs.existsSync(envFile)) {
    console.warn(`Environment file ${envFile} not found. Falling back to 'qa'.`);
    nodeEnv = 'qa';
}
require('dotenv-flow').config({
    node_env: nodeEnv,
});

export default defineConfig({
    testDir: './tests',
    timeout: 60 * 5000,
    expect: {
        timeout: 5000
    },
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    use: {
        viewport: null,
        baseURL: process.env.BASE_URL || 'QA',
        use: {
            browserPath: 'C:\\Users\\svc_jenkins\\AppData\\Local\\ms-playwright\\chromium-1179',
            trace: 'on-first-retry',
        },
        trace: 'on-first-retry',
    },
    reporter: [
        ['list'],
        ['allure-playwright'],
        [
            'playwright-qase-reporter',
            {
                mode: 'testops',
                debug: true,

                testops: {
                    api: {
                        token: process.env.QASE_API_TOKEN,
                    },
                    run: {
                        id: process.env.QASE_TESTOPS_RUN_ID,
                        title:"Qase Demo Runs",
                        complete: process.env.QASE_TESTOPS_RUN_COMPLETE === 'true',
                    },
                    project: process.env.QASE_PROJECT_CODE,
                    baseUrl: process.env.QASE_API_BASE_URL || 'https://api.qase.io',
                    uploadAttachments: true,

                },
                framework: {
                    browser: {
                        addAsParameter: true,
                        parameterName: 'Browser Name',
                    },
                },
            }
        ]
    ],
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        }
    ],
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://localhost:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});