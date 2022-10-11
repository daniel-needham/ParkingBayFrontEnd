import { Loader } from "@googlemaps/js-api-loader";

let map;
let loader;

function initMap() {

  loader = new Loader({
    apiKey: config.SECRET_API_KEY,
    version: "weekly",
    libraries: ["places"]
  });

  const mapOptions = {
    center: {
      lat: 50.82,
      lng: -0.13
    },
    zoom: 15
  };

  loader.load()
    .then((google) => {
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
    }).catch(e => {
      console.log(e);
    })
}

function initAutoCompleteSearchBox() {
  let input = document.getElementById("pac-input");
  let searchBox;
  loader.load()
    .then((google) => {
      searchBox = new google.map.place.SearchBox(input)
    }).catch(e => {
      console.log(e);
    })
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.addListener("bounds_changed", function () {
    searchBox.setBounds(map.getBounds());
  });
  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", function () {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    }
    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };
      // Create a marker for each place.
      let marker;
      loader.load()
        .then((google) => {
          marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
          })
        }).catch(e => {
          console.log(e);
        })
      markers.push(marker);
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      }
      else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

}

window.initMap = initMap();
window.initAutoCompleteSearchBox = initAutoCompleteSearchBox();