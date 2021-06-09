// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/UploadCollectionParameter"
],
    /**
         * @param {typeof sap.ui.core.mvc.Controller} Controller     
         * @param {typeof sap.m.UploadCollectionParameter} UploadCollectionParameter
         */
    function (Controller, UploadCollectionParameter) {
        return Controller.extend("projectfinal.Employees.controller.DetailsEmployee", {            

            onInit: function () {
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
                var employeeId = oEvent.getSource().getBindingContext("odataModel").getObject().EmployeeId;   
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
            }
        });
});