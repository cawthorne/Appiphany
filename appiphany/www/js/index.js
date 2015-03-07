// MAP FUNCTIONS
var map;

//https://www.mapbox.com/developers/api/
var accToken = '?access_token=pk.eyJ1IjoibWMxMzgxOCIsImEiOiI4Tlp2cFlBIn0.reMspV4lEYawDlSZ6U1fqQ';
map = L.map('map-layer', {
    attributionControl: false,
    zoomControl:false,
    //center: [51.45, -2.6],
    //zoom: 15,
    center: [51.396, -2.298],
    zoom: 14,
    minZoom: 8
});

L.tileLayer('http://{s}.tiles.mapbox.com/v4/mc13818.l2a71g35/{z}/{x}/{y}.png'.concat(accToken), {
    maxZoom: 18,
		reuseTiles: true,
    detectRetina: true,
		unloadInvisibleTiles: false
}).addTo(map);

map.on('click', function(e) {
    addMarker(e.latlng.lat, e.latlng.lng, "Hello, world!");
});
    
function addMarker(lat, lng, message) {
  L.marker([lat, lng]).addTo(map)
    .bindPopup('' + message)
    .openPopup();
}