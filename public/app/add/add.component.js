'use strict'

angular
      .module("add")
      .component("add", {
            templateUrl: 'app/add/add.template.html',
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                  console.log("Add Controller initialized");

                  var baseURL = "/api/v1/uis";

                  $scope.add = function () {
                        console.log("Inserting data...");
                        var viewFile = (document.getElementById('viewFile')).files[0];
                        var ctrlFile = (document.getElementById('ctrlFile')).files[0];
                        if (!viewFile) {
                              $scope.myValue = true;
                              $scope.error = "No view file attached";
                        } else if (!ctrlFile) {
                              $scope.myValue = true;
                              $scope.error = "No controller file attached";
                        } else if (viewFile.name.split('.')[0] != ctrlFile.name.split('.')[0]) {
                              $scope.myValue = true;
                              $scope.error = "Controller file name must be " + viewFile.name.split('.')[0] + ".controller.js";
                        } else if (viewFile.name.split('.')[1] + "." + viewFile.name.split('.')[2] != "template.html") {
                              $scope.myValue = true;
                              $scope.error = "View file extension must be " + viewFile.name.split('.')[0] + ".template.html";
                        } else if (ctrlFile.name.split('.')[1] + "." + ctrlFile.name.split('.')[2] != "controller.js") {
                              $scope.myValue = true;
                              $scope.error = "Controller file extension " + ctrlFile.name.split('.')[0] + ".controller.js";
                        } else {
                              var model = viewFile.name.split('.')[0];
                              var data = '{"uid":"' + model + '","options":[{ "view":"' + viewFile.name + '","ctrl":"' + ctrlFile.name + '"}]}';
                              const reader = new FileReader();
                              reader.onload = () => {
                                    let text = reader.result;
                                    var lines = text.split("\n").toString();
                                    if (!lines.includes(".module('renderApp')")) {
                                          $scope.myValue = true;
                                          $scope.error = ctrlFile.name + " must include .module('renderApp')";
                                          $scope.$apply();
                                    }
                                    else if (!lines.includes(".controller('" + model + "',")) {
                                          $scope.myValue = true;
                                          $scope.error = ctrlFile.name + " must include .controller('" + model + "', function...";
                                          $scope.$apply();
                                    } else {
                                          $http
                                                .post(baseURL, data)
                                                .then(function (response) {
                                                      $scope.myValue = false;
                                                      $state.go("uis");
                                                }, function (err) {
                                                      if (err.status != 201) {
                                                            $scope.myValue = true;
                                                            $scope.error = err.status + " " + err.statusText;
                                                      }
                                                });
                                    }

                              };
                              reader.readAsText(ctrlFile);

                        }
                  };

                  $scope.downloadView = function () {
                        var htmlContent = "<h5>Example Template</h5>\r\n";
                        htmlContent += "<br />\r\n";
                        htmlContent += "{{example}}\r\n";
                        htmlContent += "<br />\r\n";
                        htmlContent += "<button class='btn' ng-click='change()'>Change</button>";
                        var blob = new Blob([htmlContent], { type: 'text/html;charset=UTF-8;' });
                        if (navigator.msSaveBlob) { // IE 10+
                              navigator.msSaveBlob(blob, "example.template.html");
                        } else {
                              var link = document.createElement("a");
                              if (link.download !== undefined) { // feature detection
                                    // Browsers that support HTML5 download attribute
                                    var url = URL.createObjectURL(blob);
                                    link.setAttribute("href", url);
                                    link.setAttribute("download", "example.template.html");
                                    link.style.visibility = 'hidden';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                              }
                        }
                  }

                  $scope.downloadCtrl = function () {
                        var jsContent = "'use strict'\r\n";
                        jsContent += "\r\n";
                        jsContent += "angular\r\n";
                        jsContent += ".module('renderApp')\r\n";
                        jsContent += "      .controller('example', function ($scope, $http) {\r\n";
                        jsContent += "            console.log('Example Controller Initialized');\r\n";
                        jsContent += "            $scope.example='This is an example';\r\n";
                        jsContent += "            $scope.change=function(){\r\n";
                        jsContent += "                  $scope.example='Example Controller is working perfectly!';\r\n";
                        jsContent += "            }\r\n";
                        jsContent += "\r\n";
                        jsContent += "      });";
                        console.log(jsContent);
                        var blob = new Blob([jsContent], { type: 'text/plain;charset=UTF-8;' });
                        if (navigator.msSaveBlob) { // IE 10+
                              navigator.msSaveBlob(blob, "example.controller.js");
                        } else {
                              var link = document.createElement("a");
                              if (link.download !== undefined) { // feature detection
                                    // Browsers that support HTML5 download attribute
                                    var url = URL.createObjectURL(blob);
                                    link.setAttribute("href", url);
                                    link.setAttribute("download", "example.controller.js");
                                    link.style.visibility = 'hidden';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                              }
                        }
                  }

            }]
      });