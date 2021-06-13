// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/UploadCollectionParameter",
    "sap/m/Dialog" 
],
    /**
         * @param {typeof sap.ui.core.mvc.Controller} Controller
         * @param {typeof sap.m.UploadCollectionParameter} UploadCollectionParameter
         */
    function (Controller, UploadCollectionParameter, Dialog) {
        "use strict";
        return Controller.extend("projectfinal.Employees.controller.DetailsEmployee", {
            onInit: function() {
                this._bus = sap.ui.getCore().getEventBus();
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
                var employeeId = oEvent.getSource().getBindingContext("odataModel").getObject().EmployeeId;
                var oCustomerHeaderSlug = new UploadCollectionParameter({
                    name: "slug",
                    value: this.getOwnerComponent().SapId + ";" + employeeId + ";" + oEvent.getParameter("fileName")
                });
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },
            onStartUpload: function (oEvent) {
                var oUploadCollection = this.byId("uploadCollection");
                oUploadCollection.upload();
            },
            onUploadComplete: function(oEvent) {
                var oUploadCollection = oEvent.getSource();
                oUploadCollection.getBinding("items").refresh();
            },
            onFileDeleted: function(oEvent){
                var oUploadCollection = oEvent.getSource();
                var sPath = oEvent.getParameter("item").getBindingContext("odataModel").getPath();
                this.getView().getModel("odataModel").remove(sPath, {
                    success: function(){
                        oUploadCollection.getBinding("items").refresh();
                    },
                    error: function(){

                    }
                });
            },
            downloadFile: function(oEvent){
                var sPath = oEvent.getSource().getBindingContext("odataModel").getPath();
                window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV"+sPath+"/$value");
            },
            onDeleteEmployee: function(oEvent){
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                this.employeeId = oEvent.getSource().getBindingContext("odataModel").getObject().EmployeeId;
                //Se muestra un mensaje de confirmación
                sap.m.MessageBox.confirm(oBundle.getText("questionConfirm"),{
                    title : oBundle.getText("confirm"),
                    onClose : function(oAction){
                            if(oAction === "OK"){
                                //Se llama a la función remove
                                this.getView().getModel("odataModel").remove("/Users(EmployeeId='" + this.employeeId + "',SapId='"+this.getOwnerComponent().SapId+"')",{
                                    success : function(data){
                                        sap.m.MessageToast.show(oBundle.getText("deleteEmployeeConfirm"));
                                         this.getView().getModel("odataModel").refresh();
                                         var detailView = this.getView();
                                         var oFlexBox = detailView.byId("noData");
                                         oFlexBox.setVisible(true);
                                         var detailEmployee = detailView.byId("detailEmployee");
                                         detailEmployee.setVisible(false);
                                    }.bind(this),
                                    error : function(e){
                                        sap.base.Log.info(e);
                                    }.bind(this)
                                });
                            }
                    }.bind(this)
                });
            },
            onUpgradeEmployee: function(oEvent){
                //Creo un nuevo modelo JSON
                var salaryModel = new sap.ui.model.json.JSONModel({});
                //Obtengo el EmployeeId 
                this.employeeId = oEvent.getSource().getBindingContext("odataModel").getObject().EmployeeId;

                var oView = new sap.ui.xmlfragment("projectfinal/Employees/fragment/UpgradeEmployee", this);

                if (!this._oDialogUpgrade) {
                    this._oDialogUpgrade = new Dialog({
                                title: "{i18n>upgradeNew}",
                                content: oView,
                                beginButton: new sap.m.Button({
                                    type: sap.m.ButtonType.Emphasized,
                                    text: "{i18n>accept}",
                                    press: function (oEvent) {
                                        this.createUpgradeEmployee(oEvent);
//                                        this.getView().getModel("odataModel").refresh();
                                    }.bind(this)
                                }),
                                endButton: new sap.m.Button({
                                    text: "{i18n>cancel}",
                                    press: function () {
                                        this.onCloseDialog();
                                    }.bind(this)
                                })
                            });

                            // to get access to the controller's model
                            this.getView().addDependent(this._oDialogUpgrade);
                        }
                        //Le indico que su Modelo va a ser salaryModel
                        this._oDialogUpgrade.setModel(salaryModel,"odataSalary");
                        this._oDialogUpgrade.open();
            },
            onCloseDialog: function(){
                this._oDialogUpgrade.close();
            },

            createUpgradeEmployee: function(oEvent){
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                //Se obtiene el modelo
                var salary = this._oDialogUpgrade.getModel("odataSalary");
                //Se obtiene los datos
                var odata = salary.getData();
                //Se monta el Body para la llamada del ODATA
                var body = {
                    Ammount : odata.Ammount,
                    Waers: "EUR",
                    CreationDate : odata.CreationDate,
                    Comments : odata.Comments,
                    SapId : this.getOwnerComponent().SapId,
                    EmployeeId : this.employeeId
                };
                this.getView('detailsEmployeeView').setBusy(true);

                this.getView().getModel("odataModel").create("/Salaries",body,{
                    success : function(data){
                        this.getView('detailsEmployeeView').setBusy(false);                        
                        this.onCloseDialog();      
                        sap.m.MessageToast.show(oBundle.getText("upgradeOK"));        
                        //Lanzo el evento para que se refresque el modelo         
                        this._bus.publish("flexible", "refreshEmployee", data);
                    }.bind(this),
                    error : function(){
                        this.getView('detailsEmployeeView').setBusy(false);
                        sap.m.MessageToast.show(oBundle.getText("upgradeKO"));
                    }.bind(this)
                });
            },
            handleIconTabBarSelected: function(oEvent){
            }
        });
});