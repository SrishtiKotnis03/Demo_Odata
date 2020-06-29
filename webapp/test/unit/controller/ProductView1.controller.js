/*global QUnit*/

sap.ui.define([
	"com/demo/ZDemo_Odata_Service/controller/ProductView1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ProductView1 Controller");

	QUnit.test("I should test the ProductView1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});