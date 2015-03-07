// MAP FUNCTIONS
var map;

//https://www.mapbox.com/developers/api/


var accToken = '?access_token=pk.eyJ1IjoibWMxMzgxOCIsImEiOiI4Tlp2cFlBIn0.reMspV4lEYawDlSZ6U1fqQ';
var markers = new Array();

var lastCentre = [51.396, -2.298];

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

var markerIcon = L.icon({
    iconUrl: 'img/marker.png',
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
    popupAnchor: [0, -15],
});

map.on('click', function(e) {
    createMarker(e.latlng.lat, e.latlng.lng, "Hello, world!");
});

function createMarker(latitude, longitude, type, message) {
  var m = {
    lat: latitude,
    lng: longitude,
    msg: message
  };
  markers.push(m);
  addMarkerToMap(m.lat, m.lng, m.msg);
}

function addMarkerToMap(lat, lng, message) {
  m = L.marker([lat, lng], {icon: markerIcon});
  m.addTo(map)
    .bindPopup('<div class="popup">'+message+'<\div>')
    .openPopup();
}

function getData(){
    
    var domain ='https://appiphany.herokuapp.com';

    var box = {
      bbox: map.getBounds().toBBoxString()
    };
    var url = domain + L.Util.extend(L.Util.getParamString(parameters), box);

    $.ajax({
        url: url, success: function(result){
        for(var i =0;i < result.length-1;i++)
{
  var item = itemData[i];
  addData(item);
}
    }});
    });
};