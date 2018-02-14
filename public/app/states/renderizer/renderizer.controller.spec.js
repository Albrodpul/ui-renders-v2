var renderizer = require('./renderizer.controller.test');

describe('Custom Groups Test', function () {
    var originalTimeout;

    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });    
    it('Render-list page check', function () {
        renderizer.goRenderElementsPage();
        renderizer.checkInputs();
        renderizer.downloadExamples();
        renderizer.setRenderName("example");
        renderizer.addRender();

        var error1 = browser.driver.findElement(by.className("card-panel"));
        expect(browser.isElementPresent(error1)).toBe(true);
        browser.driver.sleep(1000);

        renderizer.clearInput();
        renderizer.setRenderName("example");
        renderizer.setModelFile("example");
        renderizer.addRender();

        var error2 = browser.driver.findElement(by.className("card-panel"));
        expect(browser.isElementPresent(error2)).toBe(true);
        browser.driver.sleep(1000);

        renderizer.clearInput();
        renderizer.setRenderName("example");
        renderizer.setModelFile("example");
        renderizer.setViewFile("example");
        renderizer.addRender();

        var error3 = browser.driver.findElement(by.className("card-panel"));
        expect(browser.isElementPresent(error3)).toBe(true);
        browser.driver.sleep(1000);

        renderizer.clearInput();
        renderizer.setRenderName("example");
        renderizer.setModelFile("example");
        renderizer.setViewFile("example");
        renderizer.setCtrlFile("example");
        renderizer.addRender();
        renderizer.goHome();
    });

    it('Renderizer page check',function(){
        renderizer.goRenderizerPage();
        renderizer.selectRender("example");
        renderizer.render();
        renderizer.downloadFiles("example");
        renderizer.goHome();
        renderizer.goRenderElementsPage();
        renderizer.deleteDismiss();
        renderizer.deleteAccept();
    });


});