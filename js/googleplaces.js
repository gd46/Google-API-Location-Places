/*
* Need to add cordova plugin for geolocation
* cordova plugin add org.apache.cordova.geolocation
* enable geolocation in phonegap configuration 
*/

var map;
var service;
var infowindow;
var latitude;
var longitude;

function getGeoLocation(){
	if(navigator.geolocation){
		// If geolocation support
		navigator.geolocation.getCurrentPosition(showPosition);
		function showPosition(position){
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;
			document.getElementById("test").innerHTML = "Lat " + latitude + " Long " + longitude;
			initialize(latitude, longitude);
		}
	} else {
		// No geolocation support
		alert("No geolocation support");
	}
}
function initialize(latitude, longitude){

	// Set map width and height once you are ready to display map
	// Grabs the devices available height and width and define the map dimensions to these specs
	var width = window.screen.availWidth;
	var height = window.screen.availHeight;
	if(height > 0){
		height = "480px";
	}
	document.getElementById('map-canvas').style.width = width;
	document.getElementById('map-canvas').style.height = height;

	var pyrmont = new google.maps.LatLng(latitude, longitude);

	map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: pyrmont,
		zoom: 11,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	// var marker = new google.maps.Marker({
 //      position: pyrmont,
 //      map: map,
 //      title: 'I am here!'
 //  	});

	var request = {
		location: pyrmont,
		radius: '5000',
		types: ['hospital']
	}
	infowindow = new google.maps.InfoWindow();
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);

	function callback(results, status){
		if(status == google.maps.places.PlacesServiceStatus.OK){
			for(var i = 0; i < results.length; i++){
				var place = results[i];
				createMarker(results[i]);
			}
		}
	}

	function createMarker(place){
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location
		});

		var url = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + pyrmont + '&destination=' + place.name + '&mode=driving';
		// $.getJSON(url, function (data) {
		//     for(var i=0;i<data.results.length;i++) {
		//         //var address = data.results[i].formatted_address;
		//         console.log(data.routes[0].legs[0].end_address);
		//     }
		//     console.log(data);
		// });
		// $.ajax({
  //           url: url, 
  //           type: "GET",   
  //           crossDomain: true,
  //           dataType: 'jsonp',
  //           success: function(response){ 
  //           	for(var i=0; i<response.length;i++){
  //           		console.log(response[i]);
  //           	}                                 
  //           }           
  //       });  
		
		//infowindow.setContent("<h5>" + place.name + '</h5><br><a href="https://maps.googleapis.com/maps/api/directions/json?origin=' + pyrmont + '&' + 'destination=' + place.name + '&mode=driving">Directions</a>');

		google.maps.event.addListener(marker, 'click', function() {

			//infowindow.setContent("<h5>" + place.name + '</h5><br><a href="https://maps.googleapis.com/maps/api/directions/json?origin=' + pyrmont + '&' + 'destination=' + place.name + '&mode=driving">Directions</a>');
			infowindow.setContent("<h5>" + place.name + '</h5><br><a target="_blank" href="http://maps.google.com/maps?saddr=' + pyrmont + '&daddr=' + place.name + '&mode=driving">Directions</a>');
			infowindow.open(map, this);

			$.ajax({
				url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + place.name + "/",
				type: "GET",
				crossDomain: true,
				dataType: 'json',
				error: function(xhr, status, error) {
	                    alert(error);
	                },
				success: function(response){
					for(var i=0; i<response.length;i++){
						var address = response[0].address_components.formatted_address;
						console.log(response[0].address_components.formatted_address);
					}
				}
			})
		});

		google.maps.event.addDomListener(map, 'click', function(){
			infowindow.close();
		});
	}
}

//google.maps.event.addDomListener(window,"load",getGeoLocation());