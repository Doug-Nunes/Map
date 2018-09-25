require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/BasemapGallery",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/widgets/Locate",
  "esri/widgets/Print",
  "esri/widgets/Home",
  "esri/widgets/Sketch/SketchViewModel",
  "esri/widgets/Search",
  "esri/widgets/ScaleBar",
  "esri/widgets/Expand",
  "esri/widgets/Legend",
  "esri/Graphic",
  "dojo/cookie", 
  "dojo/domReady!"
], function (Map, MapView, BasemapGallery,  GraphicsLayer,  FeatureLayer, Locate, Print, Home, SketchViewModel, Search, ScaleBar, Expand, Legend, GropenStreetMapon, cookie) {
  var lay  = new GraphicsLayer();

  var map = new Map({
    basemap: "streets",
    layers:[lay] 
  });
  var view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 3,
    constraints:{
      minZoom: 3,
      maxZoom: 19
    }	
  });
  var searchWidget = new Search({
    view: view
  });
  view.ui.add(searchWidget, {
    position: "top-left",
    index: 0
  });
  var homeBtn = new Home({
    view: view
  });
  view.ui.add(homeBtn, "top-left");
  var locateBtn = new Locate({
    view: view
  });
  view.ui.add(locateBtn, {
    position: "top-left"
  });
  var basemapGallery = new BasemapGallery({
    view: view,
    container:document.createElement("div")
  });
  var bgExpand = new Expand({
    view: view,
    content: basemapGallery.container,
    expandIconClass: "esri-icon-basemap"
  });
  view.ui.add(bgExpand, "top-left");
  view.then(function (evt) {
    var sketchViewModel = new SketchViewModel({
      view: view,
      pointSymbol: {
        type: "simple-marker",
        style: "circle",
        color: "orange",
        size: "18px",
        outline: {
          color: [255, 255, 255],
          width: 1
        }
      },
      polylineSymbol: {
        type: "simple-line",
        color: "orange",
        width: "3",
        style: "dash"
      },
      polygonSymbol: {
        type: "simple-fill",
        color: "rgba(226,125,30,0.1)",
        style: "solid",
        outline: {
          color: "white",
          width: 1
        }
      }
    });
    sketchViewModel.on("draw-complete", function (evt) {
      view.graphics.add(evt.graphic);
      lay.add(evt.graphic); 
      setActiveButton();
    });
    var drawPointButton = document.getElementById("pointButton");
    drawPointButton.onclick = function () {
      sketchViewModel.create("point");
      setActiveButton(this);
     };
    var drawLineButton = document.getElementById("polylineButton");
    drawLineButton.onclick = function () {
      sketchViewModel.create("polyline");
      setActiveButton(this);
    };
    var drawPolygonButton = document.getElementById("polygonButton");
    drawPolygonButton.onclick = function () {
      sketchViewModel.create("polygon");
      setActiveButton(this);
    };
    document.getElementById("resetBtn").onclick = function () {
      view.graphics.removeAll();
      lay.removeAll();
      sketchViewModel.reset();
      setActiveButton();
    };
    function setActiveButton(selectedButton) {
      view.focus();
      var elements = document.getElementsByClassName("active");
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.remove("active");
      }
      if (selectedButton) {
        selectedButton.classList.add("active");
      }
    }
  });
  view.then(function () {
    var print = new Print({
      view: view,
      printServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
      container: document.createElement("div")
    });
    var ptExpand = new Expand({
      view:view,
      content: print.container,
      expandIconClass: "esri-icon-printer"
    });
    view.ui.add(ptExpand, "top-left");
  });
  var scaleBar = new ScaleBar({
    view: view,
    unit: "dual" ,
    color: "orange"
  });
  view.ui.add(scaleBar, {
    position: "bottom-right"
  });
});