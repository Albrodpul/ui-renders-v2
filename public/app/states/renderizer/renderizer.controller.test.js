var path = require('path');
var fs = require('fs');

var renderizer = function () {
    this.goRenderElementsPage = function () {
        var renderElementsButton = element(by.xpath('//a[contains(text(), "Render Elements")]'));
        renderElementsButton.click();
        browser.driver.sleep(500);
    }

    this.checkInputs = function () {
        var renderNameInput = element(by.model("name"));
        expect(renderNameInput.isPresent()).toBe(true);
        expect(renderNameInput.getAttribute('value')).toBe('');
        var sampleModelInput = element(by.id("modelFile"));
        expect(sampleModelInput.isPresent()).toBe(true);
        var viewInput = element(by.id("viewFile"));
        expect(viewInput.isPresent()).toBe(true);
        var ctrlInput = element(by.id("ctrlFile"));
        expect(ctrlInput.isPresent()).toBe(true);
    }

    this.downloadExamples = function () {
        if (fs.existsSync("C:/tmp/example.json")) {
            // Make sure the browser doesn't have to rename the download.
            fs.unlinkSync("C:/tmp/example.json");
        }
        if (fs.existsSync("C:/tmp/example.ang")) {
            // Make sure the browser doesn't have to rename the download.
            fs.unlinkSync("C:/tmp/example.ang");
        }
        if (fs.existsSync("C:/tmp/example.ctl")) {
            // Make sure the browser doesn't have to rename the download.
            fs.unlinkSync("C:/tmp/example.ctl");
        }
        var downloadModelExample = element(by.xpath('//button[contains(text(), "Download example.json")]'));
        var downloadViewExample = element(by.xpath('//button[contains(text(), "Download example.ang")]'));
        var downloadCtrlExample = element(by.xpath('//button[contains(text(), "Download example.ctl")]'));
        downloadModelExample.click();
        browser.driver.wait(function () {
            //Wait until download is completed
            return fs.existsSync("C:/tmp/example.json");
        }, 3000).then(function () {
            // Compare what you expect with file csv content
            expect(fs.readFileSync("C:/tmp/example.json", {
                encoding: 'utf8'
            })).toEqual(
                '{ \r\n' +
                '  "renders": {\r\n' +
                '        "default": "http://localhost:8080/api/v1/renders?id=example"\r\n' +
                '   },\r\n' +
                '  "data": {\r\n' +
                '        "example":"Example working!",\r\n' +
                '        "example2":"Example is working perfectly!"\r\n' +
                '  }\r\n' +
                '}'
            );
        });
        browser.driver.sleep(2000);
        downloadViewExample.click();
        browser.driver.wait(function () {
            //Wait until download is completed
            return fs.existsSync("C:/tmp/example.ang");
        }, 3000).then(function () {
            // Compare what you expect with file csv content
            expect(fs.readFileSync("C:/tmp/example.ang", {
                encoding: 'utf8'
            })).toEqual(
                "<h5>Example Template</h5>\r\n" +
                "<br />\r\n" +
                "{{model.data.example}}\r\n" +
                "<br />\r\n" + 
                "{{something}}\r\n" +
                "<br />\r\n" +
                "<button class='btn' ng-click='generate()'>Generate</button>"
            );
        });
        browser.driver.sleep(2000);
        downloadCtrlExample.click();
        browser.driver.wait(function () {
            //Wait until download is completed
            return fs.existsSync("C:/tmp/example.ctl");
        }, 3000).then(function () {
            // Compare what you expect with file csv content
            expect(fs.readFileSync("C:/tmp/example.ctl", {
                encoding: 'utf8'
            })).toEqual(
                "'use strict'\r\n" +
                "\r\n" +
                "angular\r\n" +
                ".module('renderApp')\r\n" +
                "      .controller('example', function ($scope, $http) {\r\n" +
                "            console.log('Example Controller Initialized');\r\n" +
                "            $http.get('http://localhost:8800/app/states/renders/example/example.json')\r\n" +
                "                .then(function(response){\r\n" +
                "                      $scope.model = response.data;\r\n" +
                "            \r\n" +
                "            $scope.generate = function () {\r\n" +
                "                $scope.something = $scope.model.data.example2;\r\n" +
                "            }\r\n" +
                "\r\n" +
                "            //write your code here\r\n" +
                "\r\n" +
                "            });\r\n" +
                "      });"
            );
        });
        browser.driver.sleep(2000);
    }

    this.setRenderName = function (name) {
        var renderNameInput = element(by.id("name"));
        renderNameInput.sendKeys(name);
        expect(renderNameInput.getAttribute('value')).toBeTruthy();
        browser.driver.sleep(1000);
    }
    this.setModelFile = function (file) {
        var modelFileInput = element(by.id("modelFile"));
        var modelFileToUpload = path.resolve('C:/tmp/' + file + '.json');
        modelFileInput.sendKeys(modelFileToUpload);
        browser.driver.sleep(500);

    }

    this.setViewFile = function (file) {
        var viewFileInput = element(by.id("viewFile"));
        var viewFileToUpload = path.resolve('C:/tmp/' + file + '.ang');
        viewFileInput.sendKeys(viewFileToUpload);
        browser.driver.sleep(500);
    }

    this.setCtrlFile = function (file) {
        var ctrlFileInput = element(by.id("ctrlFile"));
        var ctrlFileToUpload = path.resolve('C:/tmp/' + file + '.ctl');
        ctrlFileInput.sendKeys(ctrlFileToUpload);
        browser.driver.sleep(500);
    }

    this.addRender = function () {
        var addRenderButton = element(by.xpath('//button[contains(text(), "Add Render")]'));
        addRenderButton.click();
        browser.driver.sleep(1500);
    }

    this.clearInput = function () {
        var renderNameInput = element(by.id("name"));
        renderNameInput.clear();
        browser.driver.sleep(1000);
    }

    this.deleteDismiss = function () {
        var renderTable = element.all(by.repeater("render in renders")).then(function (initialResults) {
            var deleteButton = browser.driver.findElement(by.xpath('//button[@data-tooltip="Borrar example!"]'));
            expect(browser.isElementPresent(deleteButton)).toBe(true);
            deleteButton.click().then(function () {
                browser.switchTo().alert().dismiss();
                element.all(by.repeater("render in renders")).then(function (results) {
                    expect(results.length).toEqual(initialResults.length);
                });
            });
        });
    }

    this.deleteAccept = function () {
        var renderTable = element.all(by.repeater("render in renders")).then(function (initialResults) {
            var deleteButton = browser.driver.findElement(by.xpath('//button[@data-tooltip="Borrar example!"]'));
            expect(browser.isElementPresent(deleteButton)).toBe(true);
            deleteButton.click().then(function () {
                browser.switchTo().alert().accept();
                element.all(by.repeater("render in renders")).then(function (results) {
                    expect(results.length).toBeLessThan(initialResults.length);
                });
            });
        });
    }

    this.goHome = function () {
        var home = element(by.className("brand-logo"));
        home.click();
        browser.driver.sleep(2000);
    }

    this.goRenderizerPage = function () {
        var renderElementsButton = element(by.xpath('//a[contains(text(), "Play Render")]'));
        renderElementsButton.click();
        browser.driver.sleep(5000);
    }

    this.selectRender = function (render) {
        var select = element(by.className("select-wrapper"));
        select.click();
        browser.driver.sleep(1000);
        var option = element(by.xpath('//span[contains(text(), "' + render + '")]'));
        option.click();
        browser.driver.sleep(1000);
    }

    this.render = function () {
        var renderButton = element(by.xpath('//a[contains(text(), "Render")]'));
        renderButton.click();
        browser.driver.sleep(5000);
        var generateButton = element(by.xpath('//button[contains(text(), "Generate")]'));
        generateButton.click();
        browser.driver.sleep(2000);
    }

    this.downloadFiles = function (name) {
        if (fs.existsSync("C:/tmp/" + name + ".json")) {
            // Make sure the browser doesn't have to rename the download.
            fs.unlinkSync("C:/tmp/" + name + ".json");
        }
        if (fs.existsSync("C:/tmp/" + name + ".ang")) {
            // Make sure the browser doesn't have to rename the download.
            fs.unlinkSync("C:/tmp/" + name + ".ang");
        }
        if (fs.existsSync("C:/tmp/" + name + ".ctl")) {
            // Make sure the browser doesn't have to rename the download.
            fs.unlinkSync("C:/tmp/" + name + ".ctl");
        }
        var downloadModel = element(by.model("model"));
        var downloadView = element(by.model("view"));
        var downloadCtrl = element(by.model("ctrl"));
        downloadModel.click();
        browser.driver.wait(function () {
            //Wait until download is completed
            return fs.existsSync("C:/tmp/" + name + ".json");
        }, 3000);
        browser.driver.sleep(2000);
        downloadView.click();
        browser.driver.wait(function () {
            //Wait until download is completed
            return fs.existsSync("C:/tmp/" + name + ".ang");
        }, 3000);
        browser.driver.sleep(2000);
        downloadCtrl.click();
        browser.driver.wait(function () {
            //Wait until download is completed
            return fs.existsSync("C:/tmp/" + name + ".ctl");
        }, 3000);
        browser.driver.sleep(2000);
    }


}

module.exports = new renderizer();