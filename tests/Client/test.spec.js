import { test, expect } from "@playwright/test";
import { qase } from "playwright-qase-reporter";


test.describe("Example: id.spec.js", () => {
    // Please, change the Id from `1` to any case Id present in your project before uncommenting the test.

    test(qase(2, "Defining Id: Format 1"), () => {
        expect(true).toBe(true);
    });

    // Please, change the Id from `2` to any case Id present in your project before uncommenting the test.

    test("Defining Id: Format 2", () => {
        qase.id(5);
        expect(true).toBe(true);
    });

    // Please, change the Id from `2` to any case Id present in your project before uncommenting the test.

    test(
        "Defining Id: Format 3",
        {
            annotation: { type: "QaseID", description: "3" },
        },
        async () => {
            expect(true).toBe(true);
        },
    );
});