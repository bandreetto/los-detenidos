const puppeteer = require("puppeteer");
const fs = require("fs");
const { fillFormData } = require("./fill-form-data");
const {
  fillCaptcha,
  reportBadCaptcha,
  reportGoodCaptcha,
} = require("./fill-captcha");

async function navigateToMexicanVisaPage(page, resolveFn) {
  console.log("Navigating to mexican visto solicitud website");
  if (resolveFn) {
    try {
      await page.goto("https://www.inm.gob.mx/sae/publico/pt/solicitud.html");
      resolveFn();
    } catch (error) {
      console.log("Failed to navigate, retrying...");
      navigateToMexicanVisaPage(page, resolveFn);
    }
    return;
  }

  return new Promise(async resolve => {
    try {
      await page.goto("https://www.inm.gob.mx/sae/publico/pt/solicitud.html");
      resolve();
    } catch (error) {
      console.log("Failed to navigate, retrying...");
      navigateToMexicanVisaPage(page, resolve);
    }
  });
}

var fillCaptchaPromise = null;
var lastCaptchaSolverId = null;

async function attemptToGetMexicanVisa(page) {
  try {
    await navigateToMexicanVisaPage(page);

    const formDataPath = process.argv[2];
    const formData = require(formDataPath);
    const fillFormPromise = fillFormData(page, formData);

    while (!fillCaptchaPromise) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    const [_, solverId] = await Promise.all([
      fillFormPromise,
      fillCaptchaPromise,
    ]);
    fillCaptchaPromise = null;
    lastCaptchaSolverId = solverId;

    console.log("All set! Submiting data!");
    await page.click("#procesar");
    await page.click("#aceptar");
  } catch (error) {
    console.error(error);
    cosnole.log("Something went wrong. Retrying...");
    attemptToGetMexicanVisa(page);
  }
}

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const [page] = await browser.pages();

  page.on("response", async response => {
    try {
      const matches = /.*\/captcha\/show.*\.jpg/.exec(response.url());
      if (!matches) return;
      const [configName] = process.argv[2].split(".config.js");
      console.log(`Found captcha image! Saving to ${configName}-captcha.jpg`);
      const captchaBuffer = await response.buffer();
      fs.writeFile(
        `${configName}-captcha.jpg`,
        captchaBuffer,
        () => (fillCaptchaPromise = fillCaptcha(page))
      );
    } catch (error) {
      console.error(error);
      cosnole.log("Something went wrong fetching captcha image. Retrying...");
      attemptToGetMexicanVisa(page);
    }
  });

  page.on("response", async response => {
    try {
      const matches =
        /.*\/sae\/resources\/solicitudes-autorizacion-electronica\/create/.exec(
          response.url()
        );
      if (!matches) return;
      if (response.status() !== 200) {
        console.log(`Visa request failed with status: ${response.status()}`);
        if (response.status() === 401) reportBadCaptcha(lastCaptchaSolverId);
        lastCaptchaSolverId = null;
        console.log("Retrying...");
        attemptToGetMexicanVisa(page);
        return;
      }
      reportGoodCaptcha(lastCaptchaSolverId);
      lastCaptchaSolverId = null;
      const visaResult = await response.json();
      if (visaResult.aprobada) {
        console.log("Visa approved! Bon Voyage!");
        try {
          await page.click("#imprime_autoizacion");
        } catch (error) {
          console.log(error);
        }
        return;
      }
      console.log("Visa request not approved!");
      console.log("Retrying...");
      attemptToGetMexicanVisa(page);
    } catch (error) {
      console.error(error);
      console.log("Something went wrong handling the response. Retrying...");
      attemptToGetMexicanVisa(page);
    }
  });

  attemptToGetMexicanVisa(page);
}

main();
