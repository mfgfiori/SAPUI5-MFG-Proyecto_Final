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
                //Recupero las rutas
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                //Navego a CreateEmployee a través de la ruta RouteCreateEmployee definida en el manifest                
                oRouter.navTo("RouteCreateEmployee", {});
            },
            onShowEmployees : function(event) {
                //Recupero las rutas
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                //Navego a ShowEmployees a través de la ruta RouteShowEmployee definida en el manifest
                oRouter.navTo("RouteShowEmployees", {});
            },
		});
	});
