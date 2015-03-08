// MAP FUNCTIONS
var map;

//https://www.mapbox.com/developers/api/


var accToken = '?access_token=pk.eyJ1IjoibWMxMzgxOCIsImEiOiI4Tlp2cFlBIn0.reMspV4lEYawDlSZ6U1fqQ';
var markers = new Object();

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

map.on('moveend', function(){
    //getData();
    popupCenterMarker();
});

function createMarker(latitude, longitude, _name, type, message, id) {
	
	if (!markers.hasOwnProperty(id)) {
		leaflet_m = addMarkerToMap(latitude, longitude, _name);
		var m = {
			lat: latitude,
			lng: longitude,
			name: _name,
			msg: message,
			leaflet_marker: leaflet_m
		};
		markers[id] = m;
	}
}

function addMarkerToMap(lat, lng, name) {
  m = L.marker([lat, lng], {icon: markerIcon});
  m.addTo(map)
    .bindPopup('<div class="popup"><div id = "profile_img"><img src="img/profiles/profile1.jpg"></div><div id = "profile_name">'+name+'</div></div>')
    .openPopup();
  return m;
}

function popupCenterMarker() {
  for (var m in markers) {
    m.leaflet_marker.closePopup();
  }
  
  var centre = getCenterMarker();
  if (centre){
	  centre.leaflet_marker.openPopup();
  }
}

function getData(){
    
    var domain ='https://appiphany.herokuapp.com';

    var box = {
      bbox: map.getBounds().toBBoxString()
    };
    var url = domain + L.Util.getParamString(box);

    $.ajax({
        url: url, success: function(result){
        for(var i =0;i < result.length-1;i++)
	{
		var item = itemData[i];
		createMarker(item.lat, item.lng, item.user_id, item.vote, item.text, item.id);
	}
    }});
};

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
   var min_dist;
   var centreMarker;
  for (var first in markers) {
	min_dist = calcDistance(center,first);
    centreMarker = first;
	break;
}

  for (var m in markers){
    var dist = calcDistance(center,m);
    if(dist < min_dist) {
		centreMarker = m;
      min_dist = dist;
      min_i = i;
    }
  }
  return centreMarker;
}

// Converts from degrees to radians.
function toRadians(degrees) {
  return degrees * Math.PI / 180;
};

$('#control-icon').click(function() {
  if($('#control-icon img').attr('src') == 'img/down.png') {
    $('#banner-layer').css('display','none');
    $('#view-message-layer').slideDown();
    $('#map-layer').css('height', '40%');
    $('#control-icon img').attr('src', 'img/up.png');
  } else if($('#control-icon img').attr('src') == 'img/up.png') {
    $('#banner-layer').slideDown();
    $('#view-message-layer').slideUp();
    $('#map-layer').css('height', 'calc(100% - 75px)');
    $('#control-icon img').attr('src', 'img/down.png');
  } else {
    $('#add-message-layer').slideUp();
    $('#banner-layer').slideDown();
    $('#button-layer').fadeIn();
    $('#control-icon img').attr('src','img/down.png');
  }
});

$('#button-add').click(function() {
  if($('#control-icon img').attr('src') == 'img/up.png') {
    $('#banner-layer').slideDown();
    $('#view-message-layer').slideUp();
    $('#map-layer').css('height', 'calc(100% - 75px)');
    $('#control-icon img').attr('src', 'img/down.png');
  }
  $('#add-message-layer').slideDown();
  $('#banner-layer').css('display','none');
  $('#button-layer').fadeOut();
  $('#control-icon img').attr('src','img/close.png');
});