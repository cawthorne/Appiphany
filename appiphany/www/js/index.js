// MAP FUNCTIONS
var map;
var userPos = new L.LatLng(0,0);
//https://www.mapbox.com/developers/api/
var onSuccess = function(position) {
  userPos = new L.LatLng(position.coords.latitude, position.coords.longitude);
  map.panTo(userPos);
};

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

navigator.geolocation.getCurrentPosition(onSuccess, onError);
var accToken = '?access_token=pk.eyJ1IjoibWMxMzgxOCIsImEiOiI4Tlp2cFlBIn0.reMspV4lEYawDlSZ6U1fqQ';
var markers = new Object();
var openmarker;
var userName = "Simon Hollis";
var _id = 10;

map = L.map('map-layer', {
    attributionControl: false,
    zoomControl:false,
    center: [51.396, -2.298],
    zoom: 14,
    minZoom: 8
});

$('#submit-button').click(function() {
  leaflet_m = addMarkerToMap(userPos.lat, userPos.lng, userName);
  var m = {
  lat: userPos.lat,
  vote: 1,
  lng: userPos.lng,
  name: userName,
  id: _id,
  msg: $('#message-input').val(),
  leaflet_marker: leaflet_m
};
$('#add-message-layer').slideUp();
$('#banner-layer').slideDown();
$('#button-layer').fadeIn();
$('#control-icon img').attr('src','img/down.png');
pushData(m);
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

getData();

map.on('moveend', function(){
  getData();
});

function o(v){
		console.log(JSON.stringify(v));
}

function deleteAllNotes(){ //not working
	var k = Object.keys(markers);
	for (var i = 0; i < k.length; i++){
		deleteNote(k[i]);
		map.removeLayer(markers[k[i]].leaflet_marker);
		delete markers[k[i]];
	}
}

function createMarker(latitude, longitude, _name, _vote, message, id) {
  if (!markers.hasOwnProperty(id)) {
		leaflet_m = addMarkerToMap(latitude, longitude, _name);
		var m = {
			lat: latitude,
			vote: _vote,
			lng: longitude,
			name: _name,
			id: _id,
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
  return m;
}

function popupCenterMarker() {

  var centre = getCenterMarker();

  if (centre){
	  centre.leaflet_marker.openPopup();
    openmarker = centre;
    $('#message-short').text(centre.msg);
    $('#message').text(centre.msg);
  }
}

function deleteNote(id){
	 var domain ='http://appiphany.herokuapp.com/removenote?';
	var url = domain + 'id=' + id;
    $.ajax({
        url: url,  dataType: 'json'});
}

function pushData(note){
	 var domain ='http://appiphany.herokuapp.com/addnote?';
	var url = domain + 'user_id=' + 1 + '&text=' + note.msg + '&vote=' + note.vote + '&lat=' + note.lat + '&lng=' + note.lng;
    $.ajax({
        url: url,  dataType: 'json', success: function(result){
        markers[result.data] = note;
    }});
}

function getData(){
    var domain ='http://appiphany.herokuapp.com/getnotes?';
	var bounds = map.getBounds();
	var url = domain + 'lat1=' + bounds._southWest.lat + '&' + 'lng1=' + bounds._southWest.lng + '&' + 'lat2=' + bounds._northEast.lat + '&' + 'lng2=' + bounds._northEast.lng;
    $.ajax({
      url: url, dataType: 'json', success: function(result){
      for(var i in result.data){
			  var item = result.data[i];
        createMarker(item.lat, item.lng, item.user_name, item.vote, item.text, item.id);
      }
      popupCenterMarker();
    }});
};

function calcDistance(p1, p2)  {
  return Math.sqrt((p2.lat-p1.lat)*(p2.lat-p1.lat) +
                   (p2.lng-p1.lng)*(p2.lng-p1.lng));
}

function getCenterMarker() {
  var center = map.getCenter();
  var min_i = 0;
  var min_dist = 9999;
  var centreMarker;
  for (var m in markers) {
  	dist = calcDistance(center,markers[m]);
    if (dist < min_dist) {
      min_dist = dist;
      centreMarker = markers[m];
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
