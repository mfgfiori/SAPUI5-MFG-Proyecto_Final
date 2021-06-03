sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageToast"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller, MessageToast) {
		"use strict";

		return Controller.extend("projectfinal.Employees.controller.MainView", {
			onInit: function () {

            },
	
	        onAfterRendering: function(){				
                var genericTileFirmarPedido = this.byId("btnSignOrder");
                //Id del dom
                var idGenericTileFirmarPedido = genericTileFirmarPedido.getId();
                //Se vacia el id
                jQuery("#"+idGenericTileFirmarPedido)[0].id = "";
	        },
            onCreateEmployee : function(event) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteCreateEmployee", {});
            },
            onShowEmployees : function(event) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteShowEmployees", {});
            },
		});
	});
