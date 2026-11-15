import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

describe("Login Flow", () => {
  it("should display login form and allow submitting credentials", async (context) => {
    const testdriver = TestDriver(context);

    // Target the application login page
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    await testdriver.provision.chrome({ url: `${appUrl}/login` });

    // Assert the login page is loaded
    const isLoginPageVisible = await testdriver.assert(
      "the LocalizeApp header and sign in form are visible"
    );
    expect(isLoginPageVisible).toBeTruthy();

    // Fill in credentials
    const emailInput = await testdriver.find("Email input field");
    await emailInput.click();
    await testdriver.type("hasanoguz.developer@gmail.com");

    const passwordInput = await testdriver.find("Password input field");
    await passwordInput.click();
    await testdriver.type("4784961Edc!");

    // Submit the form
    const signInButton = await testdriver.find("Sign In button");
    await signInButton.click();
  });
});
