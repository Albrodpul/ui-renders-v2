'use strict'

angular
      .module("addRender")
      .component("addRender", {
            templateUrl: 'app/add-render/add-render.template.html',
            controller: ["$scope", "$http", "$state", function ($scope, $http, $state) {
                  console.log("Add Render Controller initialized");

                  var hostname = window.location.hostname;
                  var http = window.location.protocol;
                  var baseURL = http + '//' + hostname + ':8080/api/v1/renders';

                  $scope.add = function () {
                        console.log("Inserting data...");
                        var name = $scope.name;
                        var modelFile = (document.getElementById('modelFile')).files[0];
                        var viewFile = (document.getElementById('viewFile')).files[0];
                        var ctrlFile = (document.getElementById('ctrlFile')).files[0];
                        if (!name) {
                              $scope.myValue = true;
                              $scope.error = "Render name input must be fulfilled";
                        } else if (!modelFile) {
                              $scope.myValue = true;
                              $scope.error = "No sample model file attached";
                        } else if (!viewFile) {
                              $scope.myValue = true;
                              $scope.error = "No view file attached";
                        } else if (!ctrlFile) {
                              $scope.myValue = true;
                              $scope.error = "No controller file attached";
                        } else if (name != modelFile.name.split('.')[0]) {
                              $scope.myValue = true;
                              $scope.error = "Sample model file name must be " + name + ".json";
                        } else if (name != viewFile.name.split('.')[0]) {
                              $scope.myValue = true;
                              $scope.error = "View file name must be " + name + ".ang";
                        } else if (name != ctrlFile.name.split('.')[0]) {
                              $scope.myValue = true;
                              $scope.error = "Controller file name must be " + name + ".ctl";
                        } else if (modelFile.name.split('.')[1] != "json") {
                              $scope.myValue = true;
                              $scope.error = "Model file extension must be .json";
                        } else if (viewFile.name.split('.')[1] != "ang") {
                              $scope.myValue = true;
                              $scope.error = "View file extension must be .ang";
                        } else if (ctrlFile.name.split('.')[1] != "ctl") {
                              $scope.myValue = true;
                              $scope.error = "Controller file extension .ctl";
                        } else {
                              var folderUrl = http + '//' + hostname + ':8800/app/renders/' + name;
                              var data = '{"id":"' + name + '", "sampleModel":"' + folderUrl + "/" + modelFile.name + '","view":"' + folderUrl + "/" + viewFile.name + '","ctrl":"' + folderUrl + "/" + ctrlFile.name + '","type":"ng"}';
                              var url = http + '//' + hostname + ':8080/api/v1/renders/' + name;
                              const reader = new FileReader();
                              reader.onload = () => {
                                    let text = reader.result;
                                    var lines = text.split("\n").toString();
                                    if (!lines.includes('"renders":')) {
                                          $scope.myValue = true;
                                          $scope.error = modelFile.name + 'must include "renders":. Download and look example.json';
                                          $scope.$apply();
                                    } else if (!lines.includes('"default": "' + url + '"')) {
                                          $scope.myValue = true;
                                          $scope.error = modelFile.name + 'must include "default": "' + url + '". Download and look example.json';
                                          $scope.$apply();
                                    } else {
                                          const reader = new FileReader();
                                          reader.onload = () => {
                                                let text = reader.result;
                                                var lines = text.split("\n").toString();
                                                if (!lines.includes(".module('renderApp')")) {
                                                      $scope.myValue = true;
                                                      $scope.error = ctrlFile.name + " must include .module('renderApp'). Download and look example.ctl";
                                                      $scope.$apply();
                                                } else if (!lines.includes(".controller('" + name + "',")) {
                                                      $scope.myValue = true;
                                                      $scope.error = ctrlFile.name + " must include .controller('" + name + "', function.... Download and look example.ctl";
                                                      $scope.$apply();
                                                } else {
                                                      $http
                                                            .post(baseURL, data)
                                                            .then(function (response) {
                                                                  $scope.myValue = false;
                                                                  $state.go("renderizer");
                                                            }, function (err) {
                                                                  if (err.status != 201) {
                                                                        $scope.myValue = true;
                                                                        $scope.error = "This render already exists";
                                                                  }
                                                            });
                                                }

                                          };
                                          reader.readAsText(ctrlFile);
                                    }
                              };
                              reader.readAsText(modelFile);
                        }
                  };

                  $scope.downloadModel = function () {
                        var url = http + '//' + hostname + ':8080/api/v1/renders/example';
                        var jsonContent = '{ \r\n';
                        jsonContent += '  "renders": [{\r\n';
                        jsonContent += '        "default": "' + url + '"\r\n';
                        jsonContent += '   }],\r\n';
                        jsonContent += '  "data": [{\r\n';
                        jsonContent += '        "example":"false",\r\n';
                        jsonContent += '        "example2":"true"\r\n';
                        jsonContent += '  }]\r\n';
                        jsonContent += '}';
                        var blob = new Blob([jsonContent], {
                              type: 'text/html;charset=UTF-8;'
                        });
                        if (navigator.msSaveBlob) { // IE 10+
                              navigator.msSaveBlob(blob, "example.json");
                        } else {
                              var link = document.createElement("a");
                              if (link.download !== undefined) { // feature detection
                                    // Browsers that support HTML5 download attribute
                                    var url = URL.createObjectURL(blob);
                                    link.setAttribute("href", url);
                                    link.setAttribute("download", "example.json");
                                    link.style.visibility = 'hidden';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                              }
                        }
                  }

                  $scope.downloadView = function () {
                        var htmlContent = "<h5>Example Template</h5>\r\n";
                        htmlContent += "<br />\r\n";
                        htmlContent += "{{example}}\r\n";
                        htmlContent += "<br />\r\n";
                        htmlContent += "<button class='btn' ng-click='change()'>Change</button>";
                        var blob = new Blob([htmlContent], {
                              type: 'text/html;charset=UTF-8;'
                        });
                        if (navigator.msSaveBlob) { // IE 10+
                              navigator.msSaveBlob(blob, "example.ang");
                        } else {
                              var link = document.createElement("a");
                              if (link.download !== undefined) { // feature detection
                                    // Browsers that support HTML5 download attribute
                                    var url = URL.createObjectURL(blob);
                                    link.setAttribute("href", url);
                                    link.setAttribute("download", "example.ang");
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
                        var blob = new Blob([jsContent], {
                              type: 'text/plain;charset=UTF-8;'
                        });
                        if (navigator.msSaveBlob) { // IE 10+
                              navigator.msSaveBlob(blob, "example.ctl");
                        } else {
                              var link = document.createElement("a");
                              if (link.download !== undefined) { // feature detection
                                    // Browsers that support HTML5 download attribute
                                    var url = URL.createObjectURL(blob);
                                    link.setAttribute("href", url);
                                    link.setAttribute("download", "example.ctl");
                                    link.style.visibility = 'hidden';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                              }
                        }
                  }

            }]
      });