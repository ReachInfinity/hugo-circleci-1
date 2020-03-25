const webdriver = require('selenium-webdriver');
    By = webdriver.By,
    until = webdriver.until;

// username: Username can be found at automation dashboard
const USERNAME = process.env.LAMBDA_USER;

// AccessKey:  AccessKey can be generated from automation dashboard or profile section
const KEY = process.env.LAMBDA_KEY;

// gridUrl: gridUrl can be found at automation dashboard
const GRID_HOST = 'hub.lambdatest.com/wd/hub';

function searchTextOnGoogle() {
// Setup Input capabilities
    const capabilities = {
       platform: 'windows 10',
       browserName: 'chrome',
       version: '67.0',
       resolution: '1280x800',
       network: true,
       visual: true,
       console: true,
       name: 'Test 1', // name of the test
       build: 'NodeJS build', // name of the build
       video: true,
       timezone: "UTC+01:00",
       geoLocation: "FR"
     };

// URL: https://{username}:{accessToken}@hub.lambdatest.com/wd/hub

const gridUrl = 'https://' + USERNAME + ':' + KEY + '@' + GRID_HOST;
  
// setup and build selenium driver object
     const driver = new webdriver.Builder()
     .usingServer(gridUrl)
     .withCapabilities(capabilities)
     .build();

    // navigate to a url, search for a text and get title of page
    driver.get('https://tech-lunch.cfapps.io/').then(function() {
        return driver.getCurrentUrl();
    })
    .then(function(CurrentUrl){
        console.log(CurrentUrl)
        driver.find.Element(By.linktext("Facebook link")).click()
        setTimeout(() => {  console.log("End sleep"); }, 5000);
        driver.quit();
    })
}
searchTextOnGoogle();