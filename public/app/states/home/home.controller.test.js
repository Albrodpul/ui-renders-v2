var login = function () {
    this.get = function () {
        browser.driver.manage().window().maximize();
        browser.driver.get('http://localhost:8800/#/');   
        browser.driver.sleep(3000);
    }

    //check if login button is present and visible
    this.checkLoginButton = function () {
        var loginButton = element(by.xpath('//button[contains(text(), "Log In")]'));
        expect(loginButton.isPresent()).toBe(true);
        loginButton.click();
        browser.driver.sleep(2000);
    }

    this.socialButtonClick = function () {
        var submitButton = element.all(by.className('auth0-lock-social-button-text')).get(1);
        submitButton.click();
        browser.driver.sleep(2000);
    }

    //navigate in a non-angular web page (google authentification)
    this.nonAngularPage = function () {
        browser.driver.ignoreSynchronization = true;
        browser.waitForAngularEnabled(false);
    }

    //back to sabius page
    this.angularPage = function(){
        browser.driver.ignoreSynchronization = false;
        browser.waitForAngularEnabled(true);
    }

    this.setEmail = function (email) {
        var emailInput = browser.driver.findElement(by.css('input[type=email]'));
        emailInput.sendKeys(email);
        browser.driver.sleep(500);
        var next = browser.driver.findElement(by.xpath('.//*[.="Siguiente"]'));
        next.click();
        browser.driver.sleep(2000);
    }

    this.clearEmail = function () {
        var emailInput = browser.driver.findElement(by.css('input[type=email]'));
        emailInput.clear();
        browser.driver.sleep(1000);
    }

    this.setPassword = function (password) {
        var passwordInput = browser.driver.findElement(by.css('input[type=password]'));
        passwordInput.sendKeys(password);
        browser.driver.sleep(500);
        var next = browser.driver.findElement(by.xpath('.//*[.="Siguiente"]'));
        next.click();
        browser.driver.sleep(5000);
    }

    this.clearPassword = function () {
        var passwordInput = browser.driver.findElement(by.css('input[type=password]'));
        passwordInput.clear();
        browser.driver.sleep(1000);
    }

    this.checkLoginSuccess = function(){
        var success = element(by.xpath('//a[contains(text(), "Render Elements")]'));
        expect(success.isPresent()).toBe(true);
        browser.driver.sleep(1000);
    }

};

module.exports = new login();