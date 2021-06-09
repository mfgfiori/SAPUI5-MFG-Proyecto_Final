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
                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "selectedEmployee", this.showDetailsEmployee, this);
            },		     
            showDetailsEmployee: function(category, nameEvent, oData) {
                var detailView = this.getView().byId("detailsEmployeeView");   
                var oFlexBox = detailView.byId("noData");
                oFlexBox.setVisible(false);                
                detailView.bindElement("odataModel>" + oData);

                var detailEmployee = detailView.byId("detailEmployee");
                detailEmployee.setVisible(true);    
            }
		});
	});
