const FormData = require("form-data");
const fs = require("fs");
const { request } = require("https");

const { key } = require("./2captcha-key");

async function inputCaptcha(page, captchaSolution) {
  console.log('Inputting "captcha"');
  await page.type("#captcha", captchaSolution);
}

function reportBadCaptcha(solverId) {
  console.log(`Reporting captcha id ${solverId} as bad captcha`);
  request({
    host: "2captcha.com",
    path: `/res.php?key=${key}&action=reportbad&id=${solverId}`,
    method: "GET",
  }).end();
}

function reportGoodCaptcha(solverId) {
  console.log(`Reporting captcha id ${solverId} as good captcha`);
  request({
    host: "2captcha.com",
    path: `/res.php?key=${key}&action=reportgood&id=${solverId}`,
    method: "GET",
  }).end();
}

function pollCaptcha(solverId) {
  return new Promise((resolve, reject) => {
    console.log("Fetching captcha response...");
    request(
      {
        host: "2captcha.com",
        path: `/res.php?key=${key}&action=get&id=${solverId}`,
        method: "GET",
      },
      response => {
        if (response.statusCode >= 300) {
          console.error(
            `2captcha request returned with status: ${response.statusCode}`
          );
        }
        response.on("data", async data => {
          const responseDataString = data.toString();
          if (responseDataString === "CAPCHA_NOT_READY") {
            console.log(
              "Captcha not solved yet. Checking again in 5 seconds..."
            );
            setTimeout(() => resolve(pollCaptcha(solverId)), 5000);
            return;
          }
          const [status, solution] = responseDataString.split("|");
          if (status !== "OK") {
            console.error(
              `2captcha get solution request failed with status: ${status}`
            );
            reject("Failed to solve captcha!");
          }
          console.log(`Captcha successfully solved: ${solution}`);
          resolve(solution);
        });
      }
    ).end();
  });
}

async function fillCaptcha(page) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    const [configName] = process.argv[2].split(".config.js");
    const captchaFileStream = fs.createReadStream(`${configName}-captcha.jpg`);
    form.append("key", key);
    form.append("file", captchaFileStream);
    console.log("Creating captcha solver");
    const req = request(
      {
        host: "2captcha.com",
        path: "/in.php",
        method: "POST",
        headers: form.getHeaders(),
      },
      response => {
        if (response.statusCode >= 300)
          console.error(
            `2captcha request returned with status: ${response.statusCode}`
          );
        response.on("data", async data => {
          const [status, solverId] = data.toString().split("|");
          if (status !== "OK") {
            console.error(
              `2catpcha create request failed with status: ${status}`
            );
            reject("Failed to create captcha solver!");
          }
          const solution = await pollCaptcha(solverId);
          await inputCaptcha(page, solution);
          resolve(solverId);
        });
      }
    );
    form.pipe(req);
  });
}

module.exports = {
  fillCaptcha,
  reportBadCaptcha,
  reportGoodCaptcha,
};
