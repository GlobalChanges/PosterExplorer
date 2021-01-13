{




var OpenStreetMap_DE = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
 maxZoom: 16,
 minZoom: 1,
 noWrap: true,
 zoomSnap: 0.25,
 attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
 })


var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 16,
        minZoom: 2,
        noWrap: true,
        zoomDelta: 0.25,
        zoomSnap: 0.0,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
})


var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
        noWrap: true,
        zoomSnap: 0.25,
	ext: 'jpg'
})

var baseMaps = {
    "OSM": OpenStreetMap_DE,
    "OTM": OpenTopoMap,
    "Paint": Stamen_Watercolor
};

var markers = L.LayerGroup();

var overlayMaps = {
    // "Markers": markers
};


 var map = null;
 var pointLayer = null;

 function initMap() { 

 map = L.map('map', {
     center: [40, 8],
     zoom: 1,
     layers: [OpenTopoMap] // [background, markers]
 });

 L.control.layers(baseMaps, overlayMaps).addTo(map);

 pointLayer = new L.GeoJSON(null, {
	pointToLayer: function (feature, latlng) {
		return L.marker( latlng, {icon: L.ExtraMarkers.icon(getMarkerOptions(feature.properties))} );
	}
}).addTo(map)  //  .on('click', onMapClick);  
  
map.addLayer(pointLayer);

 }

// markers
function getMarkerOptions(property) {
  // if icon -> use...
  // if topic -> use... (or subtopic ???)
  var extraOptions = {icon: 'fa-number',
    innerHTML: "<br style='font-size: 50%'/><b>'+property.id+'</b>",
    markerColor: 'orange-dark',
    iconColor: 'black',
    shape: 'circle',
    prefix: 'fa',
    number: property.id
  };
  return extraOptions;
}  


function clearPosterMarkers() {
  pointLayer.clearLayers();
}


function addPosterMarkers(posters) {
   if(!map) { initMap(); }
   for(var j=0; j<posters.length; j++) {
     var poster = posters[j]; 
     var geojsonFeature = {
      "type": "Feature",
      "properties": {
        "id": poster.id,
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [poster.location.longitude, poster.location.latitude]
      }
    };
    pointLayer.addData(geojsonFeature);
   }
 }

}
