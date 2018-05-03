(function () {

  'use strict';

  angular
    .module('renderApp')
    .controller('HomeController', homeController);

  homeController.$inject = ['authService', '$scope', '$state', '$stateParams', '$rootScope', '$http', '$window'];

  function homeController(authService, $scope, $state, $stateParams, $rootScope, $http, $window) {

    var vm = this;
    vm.auth = authService;
    vm.profile;
    window.location.href = "/#";

    var apiURL;
    var uiURL;
    var hostname = window.location.hostname;
    if (hostname == "localhost") {
      apiURL = 'http://localhost:8800/getFiles';
      uiURL = 'http://localhost:8800/app/states/renders';
    } else {
      apiURL = "https://" + hostname + "/getFiles";
      uiURL = "https://" + hostname + "/app/states/renders";
    }
    var deleteURL = '/deleteFiles';

    $http.get(apiURL)
      .then(function (response) {
        var renders = [];
        var data = response.data;
        angular.forEach(data, function (value, key) {
          var aux = [];
          var id = value[0];
          var sampleModel = uiURL + "/" + value[1] + "/" + value[1] + ".json";
          var view = uiURL + "/" + value[2] + "/" + value[2] + ".ang";
          var ctrl = uiURL + "/" + value[3] + "/" + value[3] + ".ctl";
          aux.push(id);
          aux.push(sampleModel);
          aux.push(view);
          aux.push(ctrl);
          renders.push(aux);
        });
        $scope.renders = renders;
      });

    var modelAux;
    var viewAux;
    var ctrlAux;
    if ($stateParams.model && $stateParams.view && $stateParams.ctrl) {
      modelAux = (($stateParams.model).split('/')[7]).split('.')[0];
      viewAux = (($stateParams.view).split('/')[7]).split('.')[0];
      ctrlAux = (($stateParams.ctrl).split('/')[7]).split('.')[0];
    } else {
      modelAux = null;
      viewAux = null;
      ctrlAux = null;
    }

    if (!modelAux && !viewAux && !ctrlAux) {
      $state.go("home");
      $scope.render = false;
      $rootScope.id = null;
      $rootScope.model = null;
      $rootScope.view = null;
      $rootScope.ctrl = null;
    } else {
      $http.get(apiURL)
        .then(function (response) {
          var data = response.data.filter(i => i[1] == modelAux);
          var id = data[0][0];
          var model = uiURL + "/" + data[0][1] + "/" + data[0][1] + ".json";
          var view = uiURL + "/" + data[0][2] + "/" + data[0][2] + ".ang";
          var ctrl = uiURL + "/" + data[0][3] + "/" + data[0][3] + ".ctl";
          $scope.error = "";
          (function () {
            if (window.localStorage) {
              if (!localStorage.getItem('firstLoad')) {
                localStorage['firstLoad'] = true;
                window.location.reload();
              } else
                localStorage.removeItem('firstLoad');
            }
          })();
          $state.go("home.render", {
            "model": model,
            "view": view,
            "ctrl": ctrl
          });
          $rootScope.render = true;
          $rootScope.id = id;
          $rootScope.model = model;
          $rootScope.view = view;
          $rootScope.ctrl = ctrl;
        });
    }

    $rootScope.render = false;

    $scope.checkState = function (id) {
      if (!id) {
        $state.go("home");
      } else {
        $http.get(apiURL)
          .then(function (response) {
            var data = response.data.filter(i => i[0] == id);
            var model = uiURL + "/" + data[0][1] + "/" + data[0][1] + ".json";
            var view = uiURL + "/" + data[0][2] + "/" + data[0][2] + ".ang";
            var ctrl = uiURL + "/" + data[0][3] + "/" + data[0][3] + ".ctl";
            $scope.error = "";
            $state.go("home.render", {
              "model": model,
              "view": view,
              "ctrl": ctrl
            });
            $rootScope.render = true;
            $rootScope.id = id;
            $rootScope.model = model;
            $rootScope.view = view;
            $rootScope.ctrl = ctrl;
          }, function (err) {
            $scope.error = "Render not found";
            $state.go("home");
          });
      }
    }

    $scope.add = function () {
      console.log("Inserting data...");
      var name = $scope.name;
      var modelFile = (document.getElementById('modelFile')).files[0];
      var viewFile = (document.getElementById('viewFile')).files[0];
      var ctrlFile = (document.getElementById('ctrlFile')).files[0];
      var patt = new RegExp("^[a-zA-Z0-9]+$")
      if (!name) {
        $scope.error = "Render name input must be fulfilled";
      } else if (!patt.test(name)) {
        $scope.error = "Render name can contain only letters and numbers";
      } else if (!modelFile) {
        $scope.error = "No sample model file attached";
      } else if (!viewFile) {
        $scope.error = "No view file attached";
      } else if (!ctrlFile) {
        $scope.error = "No controller file attached";
      } else if (name != modelFile.name.split('.')[0]) {
        $scope.error = "Sample model file name must be " + name + ".json";
      } else if (name != viewFile.name.split('.')[0]) {
        $scope.error = "View file name must be " + name + ".ang";
      } else if (name != ctrlFile.name.split('.')[0]) {
        $scope.error = "Controller file name must be " + name + ".ctl";
      } else if (modelFile.name.split('.')[1] != "json") {
        $scope.error = "Sample model file extension must be .json";
      } else if (viewFile.name.split('.')[1] != "ang") {
        $scope.error = "View file extension must be .ang";
      } else if (ctrlFile.name.split('.')[1] != "ctl") {
        $scope.error = "Controller file extension .ctl";
      } else {
        var folderURL = uiURL + '/' + name;
        const reader = new FileReader();
        reader.onload = () => {
          let text = reader.result;
          var lines = text.split("\n").toString();
          if (!lines.includes(".module('renderApp')")) {
            $scope.error = ctrlFile.name + " must include .module('renderApp'). Download and look example.ctl";
            $scope.$apply();
          } else if (!lines.includes(".controller('" + name + "',")) {
            $scope.error = ctrlFile.name + " must include .controller('" + name + "', function.... Download and look example.ctl";
            $scope.$apply();
          } else if (!lines.includes("$http.get('" + folderURL + "/" + name + ".json'") ||
            !lines.includes("$scope.model = response.data;")) {
            $scope.error = ctrlFile.name + " must include $http.get('" + folderURL + "/" + name + ".json') and $scope.model = response.data;. Download and look example.ctl";
            $scope.$apply();
          } else {
            var fd = new FormData();
            fd.append('name', name);
            fd.append('modelFile', modelFile);
            fd.append('viewFile', viewFile);
            fd.append('ctrlFile', ctrlFile);
            $http.post("/uploadFiles", fd, {
              transformRequest: angular.identity,
              headers: {
                'Content-Type': undefined
              }
            }).then(function (response) {
              $window.location.reload();
            });
          }
        };
        reader.readAsText(ctrlFile);
      }
    };

    $scope.downloadExampleModel = function () {
      var jsonContent = '{ \r\n';
      jsonContent += '  "type": "ng",\r\n';
      jsonContent += '  "data": {\r\n';
      jsonContent += '        "example":"Example working!",\r\n';
      jsonContent += '        "example2":"Example is working perfectly!"\r\n';
      jsonContent += '  }\r\n';
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

    $scope.downloadExampleView = function () {
      var htmlContent = "<h5>Example Template</h5>\r\n";
      htmlContent += "<br />\r\n";
      htmlContent += "{{model.data.example}}\r\n";
      htmlContent += "<br />\r\n";
      htmlContent += "{{something}}\r\n";
      htmlContent += "<br />\r\n";
      htmlContent += "<button class='btn' ng-click='generate()'>Generate</button>";
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

    $scope.downloadExampleCtrl = function () {
      var jsContent = "'use strict'\r\n";
      jsContent += "\r\n";
      jsContent += "angular\r\n";
      jsContent += ".module('renderApp')\r\n";
      jsContent += "      .controller('example', function ($scope, $http) {\r\n";
      jsContent += "            console.log('Example Controller Initialized');\r\n";
      jsContent += "            $http.get('" + uiURL + "/example/example.json')\r\n";
      jsContent += "                .then(function(response){\r\n";
      jsContent += "                      $scope.model = response.data;\r\n";
      jsContent += "            \r\n";
      jsContent += "            $scope.generate = function () {\r\n";
      jsContent += "                $scope.something = $scope.model.data.example2;\r\n";
      jsContent += "            }\r\n";
      jsContent += "\r\n";
      jsContent += "            //write your code here\r\n";
      jsContent += "\r\n";
      jsContent += "            });\r\n";
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

    $scope.delete = function (id) {
      var deleteId = window.confirm("¿Está seguro que desea borrar " + id + "?");
      if (deleteId) {
        $http.delete(deleteURL + "/" + id)
          .then(function (response) {
            $window.location.reload();
          });
      }
    }

    $scope.download = function (id) {
      var modelUrl = "app/states/renders/" + id + "/" + id + ".json";
      var modelDownload = id + ".json";
      var viewUrl = "app/states/renders/" + id + "/" + id + ".ang";
      var viewDownload = id + ".ang";
      var ctrlUrl = "app/states/renders/" + id + "/" + id + ".ctl";
      var ctrlDownload = id + ".ctl";
      var zip = new JSZip();
      $http({
        url: modelUrl,
        method: "GET",
        responseType: "blob"
      }).then(function (modelData) {
        zip.file(modelDownload, modelData.data);
        $http({
          url: viewUrl,
          method: "GET",
          responseType: "blob"
        }).then(function (viewData) {
          zip.file(viewDownload, viewData.data);
          $http({
            url: ctrlUrl,
            method: "GET",
            responseType: "blob"
          }).then(function (ctrlData) {
            zip.file(ctrlDownload, ctrlData.data);
            zip.generateAsync({
                type: "blob"
              })
              .then(function (content) {
                // see FileSaver.js
                saveAs(content, id + ".zip");
              });
          });
        });
      });
    }

  }

})();