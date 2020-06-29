function initModel() {
	var sUrl = "/V2/(S(v2qemfwl0n40vg2wss3pp4lj))/OData/OData.svc/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}