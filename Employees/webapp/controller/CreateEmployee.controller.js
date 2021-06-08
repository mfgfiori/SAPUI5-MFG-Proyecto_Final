sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/UploadCollectionParameter"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.m.UploadCollectionParameter} UploadCollectionParameter
     */
    function (Controller, JSONModel, Filter, FilterOperator, MessageBox, UploadCollectionParameter) {
        "use strict";

        return Controller.extend("projectfinal.Employees.controller.CreateEmployee", {

            _onInitWizard: function(){
                //Inicializar el wizard
                var oFirstStep = this._wizard.getSteps()[0];
                this._wizard.discardProgress(oFirstStep);
                // scroll to top
                this._wizard.goToStep(oFirstStep);
                // invalidate first step
                oFirstStep.setValidated(false);
            },    

            onBeforeRendering: function () {
                this._wizard = this.byId("CreateEmployeeWizard");
                this._oNavContainer = this.byId("wizardNavContainer");
                this._oWizardContentPage = this.byId("wizardContentPage");

                //Creo el modelo en el que guardaré los datos del empleado
                this._model = new sap.ui.model.json.JSONModel({});
                // Le indico a la vista que éste será su modelo.                
                this.getView().setModel(this._model, "odataEmployee");
                //Inicializo el wizard.
                this._onInitWizard();
            },
            onInit: function () {
//              Cargo el modelo para los datos configuración por tipo de empleado                 
                var oJSONConfigEmpl = new JSONModel();
                oJSONConfigEmpl.loadData("./model/json/configEmployee.json", false);
                this.getView().setModel(oJSONConfigEmpl, "jsonConfigEmployee");
            },

            onCancel: function () {
                MessageBox.confirm(this.oView.getModel("i18n").getResourceBundle().getText("cancelCreateEmployee"), {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            //Inicializo el wizard, para que al volver a pulsar "Crear Empleado" esté inicializado.                            
                            this._onInitWizard();                        
                            //Navego al visata MainView                            
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("RouteMainView", {}, true);
                        }
                    }.bind(this)
                });
            },

            toNextStep: function (oEvent) {
                //Obtengo el tipo de empleado seleccionado        
                var type = oEvent.getSource().data("typeEmpl");
                 
                //Busco en el Modelo de configuración los datos por defecto del mismo
                var oModel = this.getView().getModel("jsonConfigEmployee");
                const employee = oModel.getData().TypeEmployee.filter(x => x.Type === type);
            
                if (Array.isArray(employee) && !employee.length) {
                } else {
                    // this.salaryMin = employee[0].MinSalary;
                    // this.salaryMax = employee[0].MaxSalary;
                    this._model.setProperty("/type", employee[0].Type);
                    this._model.setProperty("/descType", employee[0].DescEmployee);
                    this._model.setProperty("/salaryMin", employee[0].MinSalary);
                    this._model.setProperty("/salaryMax", employee[0].MaxSalary);
                    this._model.setProperty("/netSalary", employee[0].NetSalary);
                    //Limpiamos las demás propiedades del modelo, por si ya se creó un empleado anteriormente
                    this._model.setProperty("/firstName", "");
                    this._model.setProperty("/lastName", "");
                    this._model.setProperty("/dni", "");
                    this._model.setProperty("/creationDate", null);
                    this._model.setProperty("/comments", "");
                    this._model.setProperty("/attachments", {});
                    this.getView().setModel(this._model, "odataEmployee");

                    this._wizard.setCurrentStep(this.byId("DataEmployeeStep"));
                }
            },

            additionalInfoValidation: function (oEvent, callback) {
                var dataEmployee = this._model.getData();
                var error = false;
                var isValid;

                if (!dataEmployee.firstName) {
                    this._model.setProperty("/firstNameState", "Error");
                    error = true;
                } else {
                    this._model.setProperty("/firstNameState", "None");
                };

                if (!dataEmployee.lastName) {
                    this._model.setProperty("/lastNameState", "Error");
                    error = true;
                } else {
                    this._model.setProperty("/lastNameState", "None");
                };
                //DNI
                if (!dataEmployee.dni) {
                    this._model.setProperty("/dniState", "Error");
                    error = true;
                } else {
                    this.validateDNI(oEvent);
                    var state = this._model.getProperty("/dniState");
                    if (state == "Error") {
                        error = true;                                           
                    }                    
                };
                //Fecha de incorporación
                if (!dataEmployee.creationDate) {
                    this._model.setProperty("/creationDateState", "Error");
                    error = true;
                } else {
                    this._model.setProperty("/creationDateState", "None");
                };
                if (error) {
                    isValid = false;
                    this._wizard.invalidateStep(this.byId("DataEmployeeStep"));
                } else {
                    isValid = true;
                    this._wizard.validateStep(this.byId("DataEmployeeStep"));
                }
                //Si hay callback se devuelve el valor isValid
                if (callback) {
                    callback(isValid);
                }
            },
            validateDNI: function (oEvent){
                //Se comprueba si es dni o cif. En caso de dni, se comprueba su valor. Para ello se comprueba que el tipo no sea "autonomo"
                if(this._model.getProperty("type") !== "1"){
//                    var dni = oEvent.getParameter("value");
                    var dni = this._model.getProperty("/dni");
                    var number;
                    var letter;
                    var letterList;
                    var regularExp = /^\d{8}[a-zA-Z]$/;
                    //Se comprueba que el formato es válido
                    if(regularExp.test (dni) === true){
                        //Número
                        number = dni.substr(0,dni.length-1);
                        //Letra
                        letter = dni.substr(dni.length-1,1);
                        number = number % 23;
                        letterList="TRWAGMYFPDXBNJZSQVHLCKET";
                        letterList=letterList.substring(number,number+1);
                    if (letterList !== letter.toUpperCase()) {
                        this._model.setProperty("/dniState","Error");
                    }else{
                        this._model.setProperty("/dniState","None");
//                        this.dataEmployeeValidation();
                    }
                    }else{
                        this._model.setProperty("/dniState","Error");
                    }
                }
            },
            wizardCompletedHandler: function (oEvent) {
                //Se comprueba que no haya error
                this.additionalInfoValidation(oEvent, function (isValid) {
                    if (isValid) {
                        //Se navega a la página review
                        var wizardNavContainer = this.byId("wizardNavContainer");
                        wizardNavContainer.to(this.byId("wizardReviewPage"));
                        //Se obtiene los archivos subidos
                        var uploadCollection = this.byId("uploadCollection");

                        var files = uploadCollection.getItems();
                        var numFiles = files.length;
                        this._model.setProperty("/nFiles", numFiles);

                        if (numFiles > 0) {
                            var arrayFiles = [];
                            for (var i in files) {
                                arrayFiles.push({ DocName: files[i].getFileName(), MimeType: files[i].getMimeType() });
                            }
                            this._model.setProperty("/files", arrayFiles);
                            console.log(this._model.getData());
                        } else {
                            this._model.setProperty("/files", []);
                        }
                    } else {
                        var oNextStep = this._wizard.getSteps()[1];
                         // scroll to top
                        this._wizard.goToStep(oNextStep);            
                        oNextStep.setValidated(false);                        
                    }
                }.bind(this));
            },
            _handleNavigationToStep: function (iStepNumber) {
                var fnAfterNavigate = function () {
                    this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                    this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);

                this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
                this._oNavContainer.backToPage(this._oWizardContentPage.getId());
            },
            editStepOne: function () {
                this._handleNavigationToStep(0);
            },

            editStepTwo: function () {
                this._handleNavigationToStep(1);
            },

            editStepThree: function () {
                this._handleNavigationToStep(2);
            },
            onFileChange: function (oEvent) {
                var oUploadCollection = oEvent.getSource();
                // Header Token
                var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("odataModel").getSecurityToken()
                });
                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            },
            onFileBeforeUpload: function (oEvent) {
                var oCustomerHeaderSlug = new UploadCollectionParameter({
                    name: "slug",
                    value: this.getOwnerComponent().SapId + ";" + this.newEmployee + ";" + oEvent.getParameter("fileName")
                });
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },

            onStartUpload: function (oEvent) {
                var oUploadCollection = this.byId("uploadCollection");
                oUploadCollection.upload();
            },

            onSubmit: function () {
                var json = this.getView().getModel("odataEmployee").getData();

                var body = {};
                body.SapId = this.getOwnerComponent().SapId;
                body.Type = json.type;
                body.FirstName = json.firstName;
                body.LastName = json.lastName;
                body.Dni = json.dni;
                body.CreationDate = json.creationDate;
                body.Comments = json.comments;

                body.UserToSalary = [{
                    Ammount: parseFloat(json.netSalary).toString(),
                    Comments: '',
                    Waers: "EUR"
                }];
                this.getView().setBusy(true);
                this.getView().getModel("odataModel").create("/Users", body, {
                    success: function (data) {
                        this.getView().setBusy(false);
                        //Se almacena el nuevo usuario
                        this.newEmployee = data.EmployeeId;
                        sap.m.MessageBox.information(this.oView.getModel("i18n").getResourceBundle().getText("newEmployee") + ": " + this.newEmployee, {
                            onClose: function () {
                                //Se vuelve al wizard
                                var wizardNavContainer = this.byId("wizardNavContainer");
                                wizardNavContainer.back();
                                //Inicializo el wizard, para que al volver a pulsar "Crear Empleado" esté inicializado.                            
                                this._onInitWizard();       
                                //Obtengo las rutas
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                //Se navega hacia MainView
                                oRouter.navTo("RouteMainView", {}, true);
                            }.bind(this)
                        });
                        this.onStartUpload();

                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }.bind(this)
                });
            }
        });
    });
