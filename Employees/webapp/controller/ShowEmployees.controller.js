sap.ui.define([
        "sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("projectfinal.Employees.controller.ShowEmployees", {
			onInit: function () {
                //Sunscribo esta vista a los siguientes eventos 
                this._bus = sap.ui.getCore().getEventBus();
                //Cuando se selecciona un empleado
                this._bus.subscribe("flexible", "selectedEmployee", this.showDetailsEmployee, this);
                //Cuando debe refrescarse la vista
                this._bus.subscribe("flexible", "refreshEmployee", this.refreshDetailsEmployee, this);
            },		     
            showDetailsEmployee: function(category, nameEvent, oData) {
                var detailView = this.getView().byId("detailsEmployeeView");   
                //Hago invisible el panel de No hay datos
                var oFlexBox = detailView.byId("noData");
                oFlexBox.setVisible(false);                  
                //Bindeo a la vista detailsEmployeeView el empleado seleccionado
                detailView.bindElement("odataModel>" + oData);                  
                //Hago visible el panel con el detalle del empleado               
                var detailEmployee = detailView.byId("detailEmployee");              
                detailEmployee.setVisible(true);    
            },
            refreshDetailsEmployee: function(category, nameEvent, oData){
                //Refrescar los datos, refrescando el modelo
                 this.getView().getModel("odataModel").refresh();
            }
		});
	});
