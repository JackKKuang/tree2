let myLat = 48.4284;
let myLong = -123.3656;

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
let range = 5000;

let anchort = false;
let mapAnchor;
let currentPosition;

let map;

let infoWindowPark; // for park info
let infoWindowCurrentLocation // for your location

let markers = [];
let marker;

function initMap() {

  InfoWindowCurrentLocation = new google.maps.InfoWindow();
  infoWindowPark = new google.maps.InfoWindow();

  const victoria = { lat: 48.4284, lng: -123.3656 };
  
  const newyork = { lat: 39.019444, lng: 125.738052};
  
  map = new google.maps.Map(document.getElementById("map"),{
    zoom: 16,
    center: newyork,
  });
  
  marker = new google.maps.Marker({
    position: newyork,
    map: map,
  });

  var request = {
    location: newyork,
    radius: '5000',
    query: 'park'
  };

  currentPosition = newyork;
  
  let service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
  
  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        currentPosition = pos;
        
        infoWindowPark.setPosition(pos);
        infoWindowPark.setContent("Location Found");
        infoWindowPark.open(map);
        map.setCenter(pos);
        setCurrentLocation(pos);
      },
      () => {
        handleLocationError(true, infoWindowPark, map.getCenter());
      }
      );
    }else {
      handleLocationError(false, infoWindowPark, map.getCenter());
    }
  });
  
google.maps.event.addListener(map, "click", function(event){
 
  if(anchort == true){
   
    var lat = event.latLng.lat().toFixed(4);
    var lng = event.latLng.lng().toFixed(4); 
  
    let pos = { lat: +lat, lng: +lng };
    console.log(pos);
    console.log(victoria);
    
    setCurrentLocation(pos);
    
    anchort = false;
    anchor.innerHTML = "anchor"
  }
  
});
  
let anchor = document.getElementById("anchor");
  
  anchor.addEventListener("click", function(event){
    console.log("yo");
    
    if(anchort == true){
      anchor.innerHTML = "Anchor"
      anchort = false;
    }else{
      anchort = true;
      anchor.innerHTML = "Click on map to anchor position"
    }
  });

}

function createMarker(request) {
  const marker = new google.maps.Marker({
    position: request.geometry.location,
    map: map,

    icon: {
      url: request.icon,
      scaledSize: new google.maps.Size(40,40),
      origin: new google.maps.Point(0, 0), //origin
    }
  });
  google.maps.event.addListener(marker, "click", () => {
    infoWindowPark.setContent(request.name || "");
    infoWindowPark.open(map, marker);
  });
  
  markers.push(marker);
  
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

function setMapOnAll(map){
  for (let i = 0; i < markers.length; i++){
    markers[i].setMap(map);
  }
}

function refreshMarkers(){
  setMapOnAll(null);
  markers = [];
  
  var request = {
    location: currentPosition,
    radius: range,
    query: 'park'
  };

  let service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
  
}
window.initMap = initMap;

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  range = this.value * 3000;
  refreshMarkers();
}

function setCurrentLocation(pos){
  console.log("ref")
  marker.setPosition(pos);
  console.log(marker);
  currentPosition = pos;
  refreshMarkers();
}