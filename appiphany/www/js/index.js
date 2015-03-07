// MAP FUNCTIONS
var map;

//https://www.mapbox.com/developers/api/

var accToken = '?access_token=pk.eyJ1IjoibWMxMzgxOCIsImEiOiI4Tlp2cFlBIn0.reMspV4lEYawDlSZ6U1fqQ';
var markers = new Array();
var leaflet_markers = new Array();

map = L.map('map-layer', {
    attributionControl: false,
    zoomControl:false,
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

//custom marker 
var markerIcon = L.icon({
    iconUrl: 'img/marker.png',
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
    popupAnchor: [0, -15],
});

map.on('click', function(e) {
    createMarker(e.latlng.lat, e.latlng.lng, "Mike Christensen", "Hello, World!");
});

map.on('move', popupCenterMarker);

function createMarker(latitude, longitude, _name, message) {
  leaflet_m = addMarkerToMap(latitude, longitude, _name);
  var m = {
    lat: latitude,
    lng: longitude,
    name: _name,
    msg: message,
    leaflet_marker: leaflet_m
  };
  markers.push(m);
}

function addMarkerToMap(lat, lng, name) {
  m = L.marker([lat, lng], {icon: markerIcon});
  m.addTo(map)
    .bindPopup('<div class="popup"><div id = "profile_img"><img src="img/profiles/profile1.jpg"></div><div id = "profile_name">'+name+'</div></div>')
    .openPopup();
  return m;
}

function popupCenterMarker() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].leaflet_marker.closePopup();
  }
  getCenterMarker().leaflet_marker.openPopup();
}

function calcDistance(p1, p2)  {
  //http://www.movable-type.co.uk/scripts/latlong.html
  var R = 6371000; // metres (radius of Earth)
  var phi1 = toRadians(p1.lat);
  var phi2 = toRadians(p2.lat);
  var delta_phi = toRadians(p2.lat-p1.lat);
  var delta_lambda = toRadians(p2.lng-p1.lng);

  var a = Math.sin(delta_phi/2) * Math.sin(delta_phi/2) +
          Math.cos(phi1) * Math.cos(phi2) *
          Math.sin(delta_lambda/2) * Math.sin(delta_lambda/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

function getCenterMarker() {
  var center = map.getCenter();
  var min_i = 0;
  var min_dist = calcDistance(center,markers[0]);
  for (var i = 1; i < markers.length; i++) {
    var dist = calcDistance(center,markers[i]);
    if(dist < min_dist) {
      min_dist = dist;
      min_i = i;
    }
  }
  return markers[min_i];
}

// Converts from degrees to radians.
function toRadians(degrees) {
  return degrees * Math.PI / 180;
};

$('#expand-icon').click(function() {
  if($('#expand-icon img').attr('src') == 'img/down.png') {
    $('#message-banner').slideUp();
    $('#message-layer').slideDown();
    $('#map-layer').css('height', '40%');
    $('#expand-icon img').attr('src', 'img/up.png');
  } else {
    $('#message-banner').slideDown();
    $('#message-layer').slideUp();
    $('#map-layer').css('height', 'calc(100% - 75px)');
    $('#expand-icon img').attr('src', 'img/down.png');
  }
});