/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/demo/ZDemo_Odata_Service/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});