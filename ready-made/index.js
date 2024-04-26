const { Builder, By, Key, until } = require('selenium-webdriver');
const { spawn } = require('child_process');

async function typeWithRandomDelay(element, text) {
  for (let char of text) {
    await element.sendKeys(char);
    await driver.sleep(getRandomDelay(50, 150)); // Simulate typing speed
  }
}

async function moveMouseToElement(driver, element) {
  await driver.actions().move({origin: element}).perform();
}

function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function joinAndRecordGoogleMeet(meetingLink) {
  let driver = await new Builder().forBrowser('chrome').build();
  let recordingProcess = null;

  try {
    await driver.get('https://meet.google.com/');
    
    // Simulate human-like delays
    await driver.sleep(getRandomDelay(2000, 5000));

    // Enter the meeting code
    let meetingCodeInput = await driver.findElement(By.name('id'));
    await meetingCodeInput.sendKeys(meetingLink);

    // Simulate typing speed with random delays between key presses
    await typeWithRandomDelay(meetingCodeInput, meetingLink);

    await meetingCodeInput.sendKeys(Key.RETURN);

    // Simulate human-like delays
    await driver.sleep(getRandomDelay(3000, 6000));

    // Wait for the join button to become clickable
    await driver.wait(until.elementLocated(By.css('.sUZ4id .VfPpkd-LgbsSe')));

    // Simulate mouse movement before clicking
    await moveMouseToElement(driver, await driver.findElement(By.css('.sUZ4id .VfPpkd-LgbsSe')));

    await driver.findElement(By.css('.sUZ4id .VfPpkd-LgbsSe')).click();

    // Simulate human-like delays
    await driver.sleep(getRandomDelay(5000, 8000));

    // Start recording
    recordingProcess = startRecording();

    // Optional: Handle microphone and camera permissions, if needed
    // await driver.findElement(By.css('.U26fgb')).click(); // Microphone
    // await driver.findElement(By.css('.U26fgb')).click(); // Camera

    // Wait for meeting to join
    await driver.wait(until.elementLocated(By.css('.CwaK9 .NPEfkd.RveJvd.snByac')), 10000); // Adjust timeout as needed
    console.log('Joined the meeting successfully!');

    // Simulate human-like delays
    await driver.sleep(getRandomDelay(5000, 8000));

    // Leave the meeting after a certain duration (adjust as needed)
    setTimeout(async () => {
      await driver.findElement(By.css('.U26fgb.JRY2Pb')).click(); // Click on the leave button
      console.log('Left the meeting.');
    });
  } catch (err) {
    console.error(err);
  }
}

joinAndRecordGoogleMeet('https://meet.google.com/riv-ggpu-tzt');