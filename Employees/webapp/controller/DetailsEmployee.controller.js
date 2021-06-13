// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/UploadCollectionParameter",
    "sap/m/Dialog",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/json/JSONModel"
],
    /**
         * @param {typeof sap.ui.core.mvc.Controller} Controller
         * @param {typeof sap.m.UploadCollectionParameter} UploadCollectionParameter
         */
    function (Controller, UploadCollectionParameter, Dialog, DateFormat, JSONModel) {
        "use strict";
var sText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nmaximus magna eget tempor iaculis. Aliquam erat volutpat. Morbi sodales laoreet augue ac pellentesque. In facilisis at nisl non bibendum. Cras mattis bibendum libero elementum condimentum. Quisque ac finibus elit. Nam molestie eget nisl pulvinar rutrum. Sed in vulputate lorem, convallis sodales quam. Sed condimentum turpis a feugiat commodo. Nulla finibus nec risus non tempus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean ex tortor, viverra sit amet tortor ut, placerat placerat turpis. Vivamus sapien mauris, semper vel ante ut, vestibulum pharetra orci." +
		"Curabitur vulputate nisi vel efficitur dapibus. Cras eleifend eget dui non condimentum. Aliquam sit amet eros mi. Aliquam erat volutpat. Donec rhoncus ante ut mauris tempor, sit amet pharetra urna congue. Morbi semper ullamcorper lectus a fringilla. Curabitur ac mi in risus ultrices malesuada vel quis arcu. Aenean sed nisl et augue consequat commodo. Praesent sapien enim, faucibus eget nisi in, pretium maximus lacus. Duis pulvinar dapibus neque in tristique. Integer ut neque sed enim mollis convallis. Proin nisi dolor, varius a turpis maximus, molestie suscipit enim. Praesent rutrum venenatis facilisis. Vivamus vel quam at erat aliquet ultricies. Ut aliquet semper auctor." +
		"In cursus, lorem eget convallis sodales, ante risus finibus augue, at euismod dui enim at nisl. Donec maximus, ipsum at egestas tempus, nisi urna lacinia leo, at tempor velit magna vel dui. Pellentesque fermentum auctor quam, non vehicula felis elementum nec. Quisque eget libero at dolor tincidunt imperdiet. Praesent mi mi, faucibus a neque sit amet, mollis vulputate est. Vivamus mattis facilisis nisi et tincidunt. Nam bibendum aliquet iaculis. In odio metus, semper ac placerat quis, cursus sed dolor. Mauris scelerisque sem id porta varius. Maecenas odio diam, egestas eget leo eu, sagittis convallis erat. Donec quam metus, interdum sit amet molestie ut, interdum vel arcu. Nullam dolor justo, semper convallis mollis sed, hendrerit id quam. Proin non aliquet tortor, non facilisis nibh. Praesent ut lorem tellus. Donec tincidunt condimentum condimentum. Aenean tempor lacus vel odio ultricies tempus." +
		"Donec eu lorem varius eros suscipit egestas. Etiam vel risus odio. Sed lobortis nisi vitae sodales tempor. Suspendisse ut sapien nec diam maximus convallis. Cras eu nunc aliquam, malesuada quam at, congue purus. Donec nec augue non nisi egestas rutrum id vitae justo. Donec vestibulum venenatis dui ac posuere. Aenean et enim volutpat, dignissim velit eget, tempor mauris. Sed lobortis augue ac purus blandit vestibulum. Maecenas ut bibendum diam. In a placerat nunc, et semper arcu. Quisque sollicitudin, purus sit amet efficitur vestibulum, augue urna tincidunt lectus, vitae pulvinar lorem justo id ex. Vivamus at massa arcu. Proin sapien lorem, ultrices a ullamcorper eu, tincidunt ac mi. Nam eu vulputate dui, id elementum metus. Proin finibus neque nulla, eget mattis nisi rutrum non.";
        return Controller.extend("projectfinal.Employees.controller.DetailsEmployee", {
            

	
            // formatDateTime: function (dateTime) {
            //     if (dateTime){                      
            //             //YYYY/MM/dd
            //             var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "YYYY/MM/dd"});
            //             var dateNowFormat = new Date(dateFormat.format(dateTime));                
            //     }
            //     return dateNowFormat;
            // },
            onInit: function() {            
                    var aData = {
                         Items: []
                     };
                     var oDate = new Date();
                     for (var i = 1; i < 150; i++) {
                         aData.Items.push({
                             Date: new Date(new Date(oDate).setDate(oDate.getDate() - i)),
                             Title: i + "",
                             Text: sText.substring(0, Math.random() * 1500),
                             UserName: 'User'
                         });
                     }

                     var oModel = new JSONModel(aData);

                     oModel.setSizeLimit(150);
                     this.getView().setModel(oModel,"odataTime");
                     this.getView().getBinding(); 
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
                employeeId = oEvent.getSource().getBindingContext("odataModel").getObject().EmployeeId;
                //Se muestra un mensaje de confirmación
                sap.m.MessageBox.confirm(oBundle.getText("questionConfirm"),{
                    title : oBundle.getText("confirm"),
                    onClose : function(oAction){
                            if(oAction === "OK"){
                                //Se llama a la función remove
                                this.getView().getModel("odataModel").remove("/Users(EmployeeId='" + employeeId + "',SapId='"+this.getOwnerComponent().SapId+"')",{
                                    success : function(data){
                                        sap.m.MessageToast.show(oBundle.getText("deleteEmployeeConfirm"));
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
                var salaryModel = new sap.ui.model.json.JSONModel({});
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
                        this._oDialogUpgrade.setModel(salaryModel,"odataSalary");
                        this._oDialogUpgrade.open();
            },
            onCloseDialog: function(){                
                this._oDialogUpgrade.close();
                this.getView().getModel("odataModel").refresh();
            },

            createUpgradeEmployee: function(oEvent){
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                //Se obtiene el modelo newRise
                var salary = this._oDialogUpgrade.getModel("odataSalary");
                //Se obtiene los datos
                var odata = salary.getData();
                //Se prepara la informacion para enviar a sap y se agrega el campo sapId con el id del alumno y el id del empleado
                var body = {
                    Ammount : odata.Ammount,
                    CreationDate : odata.CreationDate,
                    Comments : odata.Comments,
                    SapId : this.getOwnerComponent().SapId,
                    EmployeeId : this.employeeId
                };
                this.getView().setBusy(true);
                this.getView().getModel("odataModel").create("/Salaries",body,{
                    success : function(){
                        this.getView().setBusy(false);
                        sap.m.MessageToast.show(oBundle.getText("upgradeOK"));
                        this.onCloseDialog();
                    }.bind(this),
                    error : function(){
                        this.getView().setBusy(false);
                        sap.m.MessageToast.show(oBundle.getText("upgradeKO"));
                    }.bind(this)
                });
            },
            handleIconTabBarSelected: function(oEvent){
                var sKey = oEvent.getParameter("key");
                if (sKey === "itabSalary") {



                    var otimeLine = this.getView().byId("idTimeLine");
//                    otimeLine.refresh();
                }

            }
        });
});