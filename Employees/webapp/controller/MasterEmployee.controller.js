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
                //Recupero las rutas
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                //Navego a la vista MainView
			    oRouter.navTo("RouteMainView", {}, true);
            };

            function onSearchEmployee(oEvent){
                //Recupero el valor introducido
                var sQuery = oEvent.getSource().getValue();
                
                if (sQuery && sQuery.length > 0) {
                    //Construyo el filtro
                     var filter = new Filter("FirstName", FilterOperator.Contains, sQuery);
                     filters.push(filter);
			    }
                var oList = this.getView().byId("listEmployees");
                var oBinding = oList.getBinding("items");
                //Aplico el filtro
                oBinding.filter(filters);              
            };
            function onSelectEmployee(oEvent){
                //Recupero el path del item seleccionado
                var path = oEvent.getSource().getBindingContext("odataModel").getPath();
                //Lanzo el evento "selectedEmployee"                
                this._bus.publish("flexible", "selectedEmployee", path);
            };
            
            const Main = Controller.extend("projectfinal.Employees.controller.MasterEmployee", {});
            Main.prototype.onInit = onInit;
            Main.prototype.onButtonBack = onButtonBack;
            Main.prototype.onSearchEmployee= onSearchEmployee;
            Main.prototype.onSelectEmployee = onSelectEmployee;
            return Main;
 });
