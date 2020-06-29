sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"../utility/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageToast",
	"sap/m/MessageBox"

], function (Controller, UIComponent, JSONModel, Fragment, formatter, Filter, FilterOperator, Sorter, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("com.demo.ZDemo_Odata_Service.controller.ProductView1", {
		formatter: formatter,
		onInit: function () {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("oDataModel2");
			//console.log(oModel);

			//	oDataGlobalModel.setProperty("/oDataModel", oModel); //name of the property: oDataModel, value: oModel
			var oFormData = {
				"ID": "",
				"Name": "",
				"Rating": "",
				"Price": ""
			};
			var oViewData = {

				//"oTablevisible": true,
				"rowCount": "",
				"aList": [

					{
						"Rating": "1"
					}, {
						"Rating": "2"
					}, {
						"Rating": "3"
					}, {
						"Rating": "4"
					}, {
						"Rating": "5"
					}
				]
			};

			var oModel1 = new JSONModel(oViewData);
			this.getView().setModel(oModel1, "oViewModel");

			/*var oModel2 = new JSONModel("model/newProducts.json");
			this.getView().setModel(oModel2, "oTableModel");*/
			var oJsonModel = new sap.ui.model.json.JSONModel();

			this._fnRead();
		},
		fnCount: function () {

			var oTable = this.getView().byId("idProductsTable1");
			var oBinding = oTable.getBinding("items");
			var nlen = oBinding.getLength();
			var rowCount = nlen;

			var oModel3 = this.getView().getModel("oViewModel");
			oModel3.setProperty("/rowCount", rowCount);
		},
		_fnRead: function () {
			var that = this;

			var oModel = this.getOwnerComponent().getModel("oDataModel2");
			var oJsonModel = new sap.ui.model.json.JSONModel();
			var oFormData = {
				"ID": "",
				"Name": "",
				"Rating": "",
				"Price": ""
			};
			oModel.read("/Products", {
				success: function (oData) {
					oJsonModel.setData(oData);
					console.log("oJsonModel " + oJsonModel);
					oJsonModel.setProperty("/oFormData", oFormData);
					that.getView().setModel(oJsonModel, "OdataTableModel");
				},
				error: function (error) {

				}
			});
		},

		onClick: function (oEvent) {

			var property = this.getView().getModel("oViewModel").getProperty("/sSelect");
			var afilter = [];
			var filter1;
			if (property) {
				filter1 = new Filter("Rating", FilterOperator.EQ, property);
				afilter.push(filter1);
			}

			var oTable = this.byId("idProductsTable1");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(afilter);

		},
		onClick2: function (oEvent) {

			var property = this.getView().getModel("oViewModel").getProperty("/sSelect2");
			var afilter = [];
			var filter1;
			if (property) {
				filter1 = new Filter("Quality", FilterOperator.EQ, property);
				afilter.push(filter1);
			}

			var oTable = this.byId("idProductsTable1");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(afilter);

		},

		onEdit: function (oEvent) {
			this.mode = true;
			if (!this._oDialog) {
				///this._oDialog = sap.ui.xmlfragment("com.demo.odata.Demo_Odata_Service.view.addItem", this);
				this._oDialog = sap.ui.xmlfragment("form", "com.demo.ZDemo_Odata_Service.fragments.addItem", this);
				this.getView().addDependent(this._oDialog);
			}
			var oModel1 = this.getView().getModel("OdataTableModel");
			var data = oEvent.getSource().getBindingContext("OdataTableModel").getPath();
			var view = this.getView().getModel("OdataTableModel").getProperty(data);

			oModel1.setProperty("/oFormData/ID", view.ID);
			oModel1.setProperty("/oFormData/Name", view.Name);
			oModel1.setProperty("/oFormData/Price", view.Price);
			oModel1.setProperty("/oFormData/Rating", view.Rating);

			/*
			var display = data + "";
			var view = oModel.getProperty(display);
			console.log(display);
			console.log(view);
			oModel.setProperty("/oFormData", view);
			//	console.log(view);
			this.getView().getModel("oViewModel").setProperty("/oTablevisible", true);*/
			this._oDialog.open();

		},

		onAddItem: function (oEvent) {
			this.mode = false;

			//var oModel = this.getView().getModel("OdataTableModel");
			//oModel.setProperty("/selectedValue", "");
			if (!this._oDialog) {

				this._oDialog = sap.ui.xmlfragment("Form", "com.demo.ZDemo_Odata_Service.fragments.addItem", this);
				this.getView().addDependent(this._oDialog);
			}
			var oFormData = {
				"ID": "",
				"Name": "",
				"Rating": "",
				"Price": ""
			};

			this.getView().addDependent(this._oDialog);

			var oModel2 = this.getView().getModel("OdataTableModel");

			oModel2.setProperty("/oFormData", oFormData);
			this._oDialog.open();
			//this.getView().getModel("oViewModel").setProperty("/oTablevisible", false);
		},

		onSave: function () {
			if (this.mode === true) {
				var oModel2 = this.getView().getModel("OdataTableModel");
				var oData = oModel2.getProperty("/oFormData");
				var result = oModel2.getProperty("/oFormData/ID");
				var oModel = this.getOwnerComponent().getModel("oDataModel2");
				oModel.update("/Products(" + result + ")", oData, {
					merge: true,
					success: function (oNew) {
						MessageToast.show("Updated Successfully");
					},
					error: function (oError) {
						MessageToast.show("Update Failed");
					}
				});
				this._oDialog.close();
				this._oDialog.destroy();
				this._oDialog = null;
				this._fnRead();
			} else {

				var oModel2 = this.getView().getModel("OdataTableModel");

				var oTable = this.getView().byId("idProductsTable1");
				var oBinding = oTable.getBinding("items");
				var nlen = oBinding.getLength();
				var rowCount = nlen;

				var aItems = oTable.getItems();

				var sId;
				var len = aItems.length;
				for(var i = 0;  i < len; i++) {
					sId = (aItems[i].getAggregation("cells")[0].getProperty("text"));
					if(sId === rowCount){
						rowCount++;
					}
				}

				oModel2.setProperty("/oFormData/ID", rowCount);

				var oData = oModel2.getProperty("/oFormData");

				var oModel = this.getOwnerComponent().getModel("oDataModel2");
				oModel.create("/Products", oData, {
					success: function (oNew) {
						MessageToast.show("New Record Created Successfully");
					},
					error: function (oError) {
						MessageToast.show("Update Failed");
					}
				});
				this._oDialog.close();
				this._oDialog.destroy();
				this._oDialog = null;
				this._fnRead();
			}

		},

		onClickSort: function () {
			var oModel = this.getView().getModel("oTableModel");
			oModel.setProperty("/selectedValue", "");
			if (!this._oDialog2) {
				this._oDialog2 = sap.ui.xmlfragment("idSort", "com.demo.ZDemo_Odata_Service.fragments.sort", this);
				this.getView().addDependent(this._oDialog2);
			}
			this._oDialog2.open();
			//this.getView().getModel("oViewModel").setProperty("/oTablevisible", false);

		},
		onConfirm: function (oEvent) {

			var oTable = this.getView().byId("idProductsTable1");
			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");
			var sPath = mParams.sortItem.getKey();

			var aSorters = [];
			if (mParams.groupItem) {
				//	var sPath = mParams.groupItem.getKey();
				var bDescending = mParams.groupDescending;
				var vGroup = function (oContext) {
					var name = oContext.getProperty("Quality");
					return {
						key: name,
						text: name
					};
				};
				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
			}

			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(aSorters);
			this._oDialog = sap.ui.xmlfragment("idSort", "com.demo.ZDemo_Odata_Service.fragments.sort", this);

			this._oDialog2.close();
			this._oDialog2.destroy();
			this._oDialog2 = null;
		},
		//onExit - destroy created dialogs
		onExit: function () {
			if (this._oDialog) {
				this._oDialog.destroy();
				delete this._oDialog;
			}
			this._oDialog = null;
		},
		onDelete: function (oEvent) {
			var aData = oEvent.getSource().getBindingContext("OdataTableModel").getPath();
			var oModel1 = this.getView().getModel("OdataTableModel");
			//var view = oModel1.getProperty(aData);
			var oModel = this.getOwnerComponent().getModel("oDataModel2");
			var result1 = oModel1.getProperty(aData).ID;
			console.log(oModel1.getProperty(aData).ID);

			oModel.remove("/Products(" + result1 + ")", {
				method: "Delete",
				success: function (data) {
					MessageToast.show("Deleted item successfully");
				},
				error: function (e) {
					MessageToast.show("Deletion failed");
				}
			});
			this._fnRead();

		},

		onCancel: function () {
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;
			var oModel2 = new JSONModel("model/newProducts.json");
			this.getView().setModel(oModel2, "oTableModel");

		}
	});
});