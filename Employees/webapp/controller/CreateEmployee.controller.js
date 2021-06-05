sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("projectfinal.Employees.controller.CreateEmployee", {
            onBeforeRendering: function () {
                this._wizard = this.byId("CreateEmployeeWizard");
                this._oNavContainer = this.byId("wizardNavContainer");
                this._oWizardContentPage = this.byId("wizardContentPage");

                //Creo el modelo en el que guardaré los datos del empleado
                this._model = new sap.ui.model.json.JSONModel({});
                //Le indico a la vista que éste será su modelo.                
                this.getView().setModel(this._model, "odataEmployee");

                // this.model.setProperty("/measurement", "");

                this._setEmptyValue("/type");
                this._setEmptyValue("/descType");
                this._setEmptyValue("/netSalary");
                this._setEmptyValue("/firstName");           
                this._setEmptyValue("/lastName");           
                this._setEmptyValue("/dni");  
//                this._setEmptyValue("/creationDate"); 

                //Se reseta los pasos por si ya se ha ejecutado la aplicacion antes
                var oFirstStep = this._wizard.getSteps()[0];
                this._wizard.discardProgress(oFirstStep);
                // scroll to top
                this._wizard.goToStep(oFirstStep);
                // invalidate first step
                oFirstStep.setValidated(false);
            },

            onInit: function () {
                var oJSONConfigEmpl = new JSONModel();
                oJSONConfigEmpl.loadData("./model/json/configEmployee.json", false);
                this.getView().setModel(oJSONConfigEmpl, "jsonConfigEmployee");
            },

            onCancel: function () {
                MessageBox.confirm(this.oView.getModel("i18n").getResourceBundle().getText("cancelCreateEmployee"), {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("RouteMainView", {}, true);
                        }
                    }.bind(this)
                });
            },

            toNextStep: function (oEvent) {

                var type = oEvent.getSource().data("typeEmpl");

                var oModel = this.getView().getModel("jsonConfigEmployee");
                const employee = oModel.getData().TypeEmployee.filter(x => x.Type===type);

                console.log(employee[0]);
                if(Array.isArray(employee) && !employee.length){
                } else {  
                    this.salaryMin = employee[0].MinSalary;
                    this.salaryMax = employee[0].MaxSalary;
                    this._model.setProperty("/type", employee[0].Type);
                    this._model.setProperty("/descType", employee[0].DescEmployee);
                    
                    this._model.setProperty("/salaryMin", employee[0].MinSalary);
                    this._model.setProperty("/salaryMax", employee[0].MaxSalary);
                    this._model.setProperty("/netSalary", employee[0].NetSalary);

                    this._wizard.setCurrentStep(this.byId("DataEmployeeStep"));
                }
            },
            _setEmptyValue: function (sPath) {
                this._model.setProperty(sPath, "");
            },

            additionalInfoValidation: function(){
                var dataEmployee = this._model.getData();
                var error = false;
            
                if(!dataEmployee.firstName){
                    this._model.setProperty("/firstNameState", "Error");
                    error = true;
                } else {
                    this._model.setProperty("/firstNameState", "None");
                };

                if(!dataEmployee.lastName){
                    this._model.setProperty("/lastNameState", "Error");
                    error = true;
                } else {
                    this._model.setProperty("/lastNameState", "None");
                };
                		//DNI
                if(!dataEmployee.dni){
                    this._model.setProperty("/dniState", "Error");                    
                     error = true;
                }else{
                    this._model.setProperty("/dniState", "None");                    
                };
                		//Fecha de incorporación
                if(!dataEmployee.creationDate){
                    this._model.setProperty("/creationDateState", "Error");                    
                     error = true;
                }else{
                    this._model.setProperty("/creationDateState", "None");                    
                };
                if ( error ) {
                    this._wizard.invalidateStep(this.byId("DataEmployeeStep"));
                } else {
                    this._wizard.validateStep(this.byId("DataEmployeeStep"));
                }
            },
            //Función para validar el dni
            validateDNI : function(oEvent) {
                //Se comprueba si es dni o cif. En caso de dni, se comprueba su valor. Para ello se comprueba que el tipo no sea "autonomo"
                if(this._model.getProperty("type") !== "1"){
                    var dni = oEvent.getParameter("value");
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
                        this.additionalInfoValidation();
                    }
                    }else{
                        this._model.setProperty("/dniState","Error");
                    }
                }
            },

            wizardCompletedHandler: function(){
	            this._oNavContainer.to(this.byId("wizardReviewPage"));
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
            onSubmit: function () {
                
            },
        });
    });
