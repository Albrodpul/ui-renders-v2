var login = require('./home.controller.test');
describe('login test', function () {
    it('Checks login button exist', function () {
        login.get();
        login.checkLoginButton();
    });
    it('Click on google button', function () {
        login.nonAngularPage();
        login.socialButtonClick();
    });
    it('Set wrong email', function () {
        login.setEmail("test");
        var errorEmail = browser.driver.findElement(by.xpath('.//*[.="No se ha podido encontrar tu cuenta de Google"]'));
        expect(browser.isElementPresent(errorEmail)).toBe(true);
    });
    it('Set correct email', function () {
        login.clearEmail();
        login.setEmail("testsabius@gmail.com");
    });
    it('Set wrong password', function () {
        login.setPassword("test");
        var errorPassword = browser.driver.findElement(by.xpath('.//*[.="Contraseña incorrecta. Vuelve a intentarlo o haz clic en Contraseña olvidada para cambiarla."]'));
        expect(browser.isElementPresent(errorPassword)).toBe(true);
    });
    it('Set correct password', function () {
        login.clearPassword();
        login.setPassword("testsabius123");
    });
    it('Check login has succeded', function () {
        login.angularPage();
        login.checkLoginSuccess();
    });
});


