// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
         * @param {typeof sap.ui.core.mvc.Controller} Controller     
         * @param {typeof sap.ui.model.Filter} Filter
         * @param {typeof sap.ui.model.FilterOperator} FilterOperator
         */
    function (Controller, Filter, FilterOperator) {
           "use strict";  

            function onInit(){
                this._bus = sap.ui.getCore().getEventBus();    
            };

            function onButtonBack(oEvent){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			    oRouter.navTo("RouteMainView", {}, true);
            };
            function onSearchEmployee(oEvent){

                var sQuery = oEvent.getSource().getValue();
                
                if (sQuery && sQuery.length > 0) {
                     var filter = new Filter("FirstName", FilterOperator.Contains, sQuery);
                     filters.push(filter);

			    }
                var oList = this.getView().byId("listEmployees");
                var oBinding = oList.getBinding("items");
                oBinding.filter(filters);              
            };
            function onSelectEmployee(oEvent){
                var path = oEvent.getSource().getBindingContext("odataModel").getPath();
                this._bus.publish("flexible", "selectedEmployee", path);
            };
            
            const Main = Controller.extend("projectfinal.Employees.controller.MasterEmployee", {});
            Main.prototype.onInit = onInit;
            Main.prototype.onButtonBack = onButtonBack;
            Main.prototype.onSearchEmployee= onSearchEmployee;
            Main.prototype.onSelectEmployee = onSelectEmployee;
            return Main;
 });
