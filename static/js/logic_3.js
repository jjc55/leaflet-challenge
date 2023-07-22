//Check to see if links work
console.log("Start of code in logic_1, testing")

//Logic_1 creates the initial tile layers, a black layerGroup for the earthquakes and a layer control

//logic_2 gets the USGS earthquake data and creates a circleMarker 
//using a common radius, common color, and popup with location, time, and magnitude and depth

// logic_3 creates circleMarker with radius as a function of magnitude markerSize()
// and color as a function of depth: function called markerColor()
// with an overall style Info function that calls both styleInfo()

// Create the base layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'+
    '<br> Lead Analyst: Juhi <br> <a href="https://github.com/jjc55/leaflet-challenge">GitHub Repository</a>'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'+
    '<br> Lead Analyst: Juhi <br> <a href="https://github.com/jjc55/leaflet-challenge">GitHub Repository</a>'
});

// Create a baseMaps object.
let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};

// Create an empty new leaflet layerGroup for earthquakes 
let earthquakes = new L.layerGroup()

// Create an overlay object to hold our overlay.
let overlayMaps = {
    Earthquakes: earthquakes
};

// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
});

// Create a layer control.
// Pass it our baseMaps and overlayMaps.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

//get earthquake data from USGS
// Store our API endpoint as queryUrl. 
// go to USGS site for earthquakes >> data >> realtime feeds >> GeoJSON Summary Feed >> Past 7 Days and M1.0+Earthquakes
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

// Perform a d3.json AJAX request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  //createFeatures(data.features);
  console.log(data.features[0]);
  
  //create function for marker size
  function markerSize(magnitude){
    // note: I am using a USGS feed for magnitude of 1+ therefore I will not have a circle with radius 0
    return magnitude * 4
  }

  // create a function for markerColor using depth (km) function 
  function markerColor(depth){
    return depth > 150 ? '#d73027' :
    depth > 100  ? '#f46d43' :
    depth > 50  ? '#fdae61' :
    depth > 25  ? '#fee08b' :
    depth > 15   ? '#d9ef8b' :
    depth > 10   ? '#a6d96a' :
    depth > 5   ? '#66bd63' :
               '#1a9850';
  }
  
  // create a GeoJSON layer using data
  function styleInfo(feature){
    return {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    };
  }

L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },

    // use styleInfo to define circleMarker styel
    style: styleInfo,

    // use onEachFeature to add a popup with location, time, and magnitude and depth
    onEachFeature: function onEachFeature(feature, layer){ 
        layer.bindPopup(`
        <h3>${feature.properties.place}</h3>
        <hr>
        <p>${new Date(feature.properties.time)}</p>
        <h3>Magnitude: ${feature.properties.mag.toLocaleString()}</h3>
        <h3>Depth: ${feature.geometry.coordinates[2].toLocaleString()}</h3>
        `);
    }
}).addTo(earthquakes);

//data with d3 is only available above this point!
});



