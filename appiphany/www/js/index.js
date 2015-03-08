// MAP FUNCTIONS
var map;
var _vote = 2;
var userPos = new L.LatLng(0,0);
//https://www.mapbox.com/developers/api/
var onSuccess = function(position) {
  userPos = new L.LatLng(position.coords.latitude, position.coords.longitude);
  map.panTo(userPos);
};

function onError(error) {
    console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}


var accToken = '?access_token=pk.eyJ1IjoibWMxMzgxOCIsImEiOiI4Tlp2cFlBIn0.reMspV4lEYawDlSZ6U1fqQ';
var markers = new Object();
var openmarker;
var userName = "Simon Hollis";
var _id = 10;
var heat_red;
var heat_green;
function initMap() {

  map = L.map('map-layer', {
      attributionControl: false,
      zoomControl:false,
      center: [51.455042, -2.603457],
      zoom: 14,
      minZoom: 8
  });
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
  L.tileLayer('http://{s}.tiles.mapbox.com/v4/mc13818.l2a71g35/{z}/{x}/{y}.png'.concat(accToken), {
    maxZoom: 18,
		reuseTiles: true,
    detectRetina: true,
		unloadInvisibleTiles: false
  }).addTo(map);

  map.on('popupopen', function(e) {
    var marker = e.popup._source;
    for(var m in markers) {
      if(markers[m].leaflet_marker == marker) {
        updateMessageBanner(markers[m]);
      }
    }
  });

  getData();

  heat_red = L.heatLayer([], {minOpacity: 0, radius: 25, gradient: {0: '#ff0000', 1: '#ff0000'}}).addTo(map);
  heat_green = L.heatLayer([], {minOpacity: 0,radius: 25, gradient: {0: '#00ff00', 1: '#00ff00'}}).addTo(map);

  map.on('moveend', function(){
    getData();
  });
}

function updateHeat() {
  for(var m in markers) {
    if(markers[m].vote == 0) {
      heat_red.addLatLng(L.latLng(markers[m].lat, markers[m].lng));
    } else {
      heat_green.addLatLng(L.latLng(markers[m].lat, markers[m].lng));
    }
  }

}

$('#signin-button').click(function() {
  userName = $("#login-input").val();
  $("#profile-name").text(userName);
  $.ajax({
      url: 'http://appiphany.herokuapp.com/adduser?name='+userName, dataType: 'json', success: function(result){
        _id = result.data;
      }
    });

})
$('#submit-button').click(function() {
  leaflet_m = addMarkerToMap(userPos.lat, userPos.lng, userName);
  if (($('#message-input').val() != '' && _vote != 2)){
	var m = {
		lat: userPos.lat,
		vote: _vote,
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
	_vote = 2;
	$('#thumb2 img').attr('src','img/thumb_down.png');
	$('#thumb1 img').attr('src','img/thumb_up.png');
	$('#message-input').val('');
  }
});

function inv(v){
	if (v == 0){
		return 1;
	} else {
		return 0
	}
}

$('#thumb1').click(function() {
	_vote = 1;
	$('#thumb1 img').attr('src','img/thumb_up_green.png');
	$('#thumb2 img').attr('src','img/thumb_down.png');
});

$('#thumb2').click(function() {
	$('#thumb2 img').attr('src','img/thumb_down_red.png');
	$('#thumb1 img').attr('src','img/thumb_up.png');
	_vote = 0;
});

//custom marker
var markerIcon = L.icon({
    iconUrl: 'img/transparent.png',
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
    popupAnchor: [0, -15],
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

function createMarker(latitude, longitude, date, _name, _vote, message, id) {
  if (!markers.hasOwnProperty(id)) {

		leaflet_m = addMarkerToMap(latitude, longitude, _name);
		var m = {
			lat: latitude,
			vote: _vote,
	 		lng: longitude,
			name: _name,
      age: Math.floor(((Date.now() - Date.parse(date))/1000)/60),
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

function updateMessageBanner(m) {
  $('#message-short').text(m.msg);
  $('#message').text(m.msg);
  $('#profile-name').text(userName);
  $('#post-time').text('Posted '+m.age+' minutes ago');
  if(m.vote) {
    $('#banner-thumb img').attr('src', 'img/thumb_up_green.png');
    $('#thumb-icon img').attr('src', 'img/thumb_up_green.png');
  } else {
    $('#banner-thumb img').attr('src', 'img/thumb_down_red.png');
    $('#thumb-icon img').attr('src', 'img/thumb_down_red.png');
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
	var url = domain + 'user_id=' + _id + '&text=' + note.msg + '&vote=' + note.vote + '&lat=' + note.lat + '&lng=' + note.lng;
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
      createMarker(item.lat, item.lng, item.date, item.user_name, item.vote, item.text, item.id);
    }
    //popupCenterMarker();
    updateHeat();
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

var mq = window.matchMedia( "only screen and (max-width: 320px)" );
$('#control-icon').click(function() {
  if($('#control-icon img').attr('src') == 'img/down.png') {
    $('#banner-layer').css('display','none');
    $('#view-message-layer').css('display','block');
    $('#map-layer').css('height', '40%');
    $('#control-icon img').attr('src', 'img/up.png');
  } else if($('#control-icon img').attr('src') == 'img/up.png') {
    $('#banner-layer').slideDown();
    $('#view-message-layer').slideUp();
    if(mq.matches) {
      $('#map-layer').css('height', 'calc(100% - 60px)');
    } else {
      $('#map-layer').css('height', 'calc(100% - 80px)');
    }
    $('#control-icon img').attr('src', 'img/down.png');
  } else {
    $('#add-message-layer').hide();
    $('#banner-layer').fadeIn();
    $('#button-layer').fadeIn();
    $('#control-icon img').attr('src','img/down.png');
  }
});

$('#button-add').click(function() {
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
  if($('#control-icon img').attr('src') == 'img/up.png') {
    $('#view-message-layer').hide();
    if(mq.matches) {
      $('#map-layer').css('height', 'calc(100% - 60px)');
    } else {
      $('#map-layer').css('height', 'calc(100% - 80px)');
    }
    $('#control-icon img').attr('src', 'img/down.png');
  }
  $('#add-message-layer').fadeIn();
  $('#banner-layer').hide();
  $('#button-layer').hide();
  $('#control-icon img').attr('src','img/close.png');
});

$('#signin-button').click(function() {
  $('#banner-layer').show();
  $('#map-layer').show();
  $('#button-layer').show();
  $('#control-icon').show();
  $('#sign-in-layer').hide();
  initMap();
});
