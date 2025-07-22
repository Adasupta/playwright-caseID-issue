require('dotenv').config();

const { test, expect } = require('@playwright/test');


test.describe('Inspect/Review Doc Action Modify feature', () => {
    test.skip('Validate Modify options', async ({ page }) => {

    });
    test.describe.skip('Validate Modify Native/ Image/ Text', () => {
        test.skip('Validate Replace Native file ', async ({ page }) => {
        });
        test.skip('Validate Delete Native file ', async ({ page }) => {
        });
        test.skip('Validate Replace Image file ', async ({ page }) => {
        });
        test.skip('Validate Delete Image file ', async ({ page }) => {
        });
        test.skip('Validate Delete Extracted Text ', async ({ page }) => {
        });
        test.skip('Validate Delete OCR Text ', async ({ page }) => {
        });
        test.skip('Validate Replace Extracted Text ', async ({ page }) => {
        });
        test.skip('Validate Replace OCR Text ', async ({ page }) => {
        });

    });
    test.describe.skip('Validate Modify Metadata', () => {
        test.describe.skip(`Validate Modify Metadata 'Create'`, () => {
            test.skip('Verify Create field/value options', async ({ page }) => {
            });
            test.skip('Verify Create new field', async ({ page }) => {
            });
            test.skip('Verify Modify Create Job submission', async ({ page }) => {
            });

        });

        test.describe.skip(`Validate Modify Metadata 'Create/Update'`, () => {
            test.skip('Verify Create field/value options', async ({ page }) => {
            });

            test.skip('Verify Modify Create/update Job submission', async ({ page }) => {
            });

        });
        test.describe.skip(`Validate Modify Metadata 'Merge/List'`, () => {
            test.skip('Verify Create Merge/List options', async ({ page }) => {
            });

            test.skip('Verify Modify Target field values', async ({ page }) => {
            });
            test.skip('Verify Modify Source field values', async ({ page }) => {
            });
            test.skip('Verify Modify Add/Remove Source field values', async ({ page }) => {
            });
            test.skip('Verify Modify Merge/List Job submission', async ({ page }) => {
            });

        });
        test.describe.skip(`Validate Modify Metadata 'Merge/Hierarchy'`, () => {
            test.skip('Verify Create Merge/Hierarchy options', async ({ page }) => {
            });

            test.skip('Verify Modify Target field values', async ({ page }) => {
            });
            test.skip('Verify Modify Source field values', async ({ page }) => {
            });
            test.skip('Verify Modify Add/Remove Source field values', async ({ page }) => {
            });
            test.skip('Verify Modify Merge/Hierarchy Job submission', async ({ page }) => {
            });

        });
        test.describe.skip(`Validate Modify Metadata 'Rename Document Number'`, () => {
            test.skip('Verify Rename document Number  options', async ({ page }) => {
            });

            test.skip('Verify Preview document', async ({ page }) => {
            });

            test.skip('Verify Modify Rename Document Number Job submission', async ({ page }) => {
            });

        });

        test.describe.skip(`Validate Modify Metadata 'Replace'`, () => {
            test.skip('Verify Replace options', () => {
            });

            test.skip('Verify Replace field/value options', () => {
            });

            test.skip('Verify Modify Replace Job submission', () => {
            });

        });
        test.describe.skip(`Validate Modify Metadata 'Remove'`, () => {
            test.skip('Verify Remove options', () => {
            });

            test.skip('Verify Remove field options', () => {
            });

            test.skip('Verify Modify Remove Job submission', () => {
            });

        });

    });
});
