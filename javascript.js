var map = L.map('map').setView([47.267, -122.437], 7);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 22,
    id: 'mapbox/satellite-streets-v12',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoiam9obmthbWF1IiwiYSI6ImNsY2xmNjk4cTYzaTgzcWxrdzBtNWs2cWMifQ.FkeyGo6hi5tW9dx-GmAhHA'
}).addTo(map);
//Drawing controls
var drawnItems = L.featureGroup().addTo(map);
new L.Control.Draw({
    draw : {
        polygon : true,
        polyline : true,
        rectangle : true,    
        circle : false,        // Circles disabled 
        circlemarker : false,  // Circle markers disabled
        marker: true
    },
    edit : {
        featureGroup: drawnItems
    }
}).addTo(map);
//Popup for username and description
function createFormPopup() {
    var popupContent =
        '<form>' +
        'Description:<br><input type="text" id="input_desc"><br>' +
        'User\'s Name:<br><input type="text" id="input_name"><br>' +
        'Views:<br>' +
        '<select id="input_views">' +
        '<option value="City lights">City lights</option>' +
        '<option value="Water Bodies">Water Bodies</option>' +
        '<option value="Nature">Nature</option>' +
        '<option value="Hikes">Hikes</option>' +
        '<option value="Other">Other</option>' +
        '</select><br>' +
        'ADA accessibility:<br>' +
        '<input type="radio" id="input_ada_accessibility_yes" name="ada_accessibility" value="Accessible">' +
        '<label for="input_ada_accessibility_yes">Accessible</label><br>' +
        '<input type="radio" id="input_ada_accessibility_no" name="ada_accessibility" value="Not Accessible">' +
        '<label for="input_ada_accessibility_no">Not Accessible</label><br>' +
        'Parking Availability:<br>' +
        '<input type="text" id="input_parking" placeholder="Enter number of available parking spots"><br>' +
        '<small>Please enter the number of available parking spots. If there is no parking available, please enter 0.</small><br>' +
        'Distance from main roads:<br>' +
        '<input type="text" id="input_distance" placeholder="Enter distance in miles"><br>' +
        '<small>Please enter the distance in miles from the nearest main road to the location.</small><br>' +
        '<input type="button" value="Submit" id="submit">' +
        '</form>';

    drawnItems.bindPopup(popupContent).openPopup();
}

//Event listener for popup when drawing is created
map.addEventListener("draw:created", function(e) {
    e.layer.addTo(drawnItems);
    createFormPopup();
});
    drawnItems.eachLayer(function(layer) {
        var geojson = JSON.stringify(layer.toGeoJSON().geometry);
        console.log(geojson);
    });
    function setData(e) {
        if (e.target && e.target.id == "submit") {
          // Get user name and description
          var enteredUsername = document.getElementById("input_name").value;
          var enteredDescription = document.getElementById("input_desc").value;
          // Get views
          var selectedViews = document.getElementById("input_views").value;
          // Get ADA accessibility
          var isAccessible = document.getElementById("input_ada_accessibility_yes").checked;
          var isNotAccessible = document.getElementById("input_ada_accessibility_no").checked;
          var adaAccessibility = isAccessible ? "Accessible" : (isNotAccessible ? "Not Accessible" : "");
          // Get parking availability and distance from main roads
          var enteredParkingAvailability = document.getElementById("input_parking").value;
          var enteredDistanceFromMainRoads = document.getElementById("input_distance").value;
      
          // Print user name, description, views, ADA accessibility, parking availability, and distance from main roads
          console.log("Name: " + enteredUsername);
          console.log("Description: " + enteredDescription);
          console.log("Views: " + selectedViews);
          console.log("ADA Accessibility: " + adaAccessibility);
          console.log("Parking Availability: " + enteredParkingAvailability);
          console.log("Distance from Main Roads: " + enteredDistanceFromMainRoads);
      
          // Get and print GeoJSON for each drawn layer
          drawnItems.eachLayer(function(layer) {
            var drawing = JSON.stringify(layer.toGeoJSON().geometry);
            console.log("Drawing: " + drawing);
          });
      
          // Clear drawn items layer
          drawnItems.closePopup();
          drawnItems.clearLayers();
        }
      }
      
    //Event listener for popup submit button
    document.addEventListener("click", setData);
    //Event listener for start/stop editing
    map.addEventListener("draw:editstart", function(e) {
        drawnItems.closePopup();
    });
    map.addEventListener("draw:deletestart", function(e) {
        drawnItems.closePopup();
    });
    map.addEventListener("draw:editstop", function(e) {
        drawnItems.openPopup();
    });
    map.addEventListener("draw:deletestop", function(e) {
        if(drawnItems.getLayers().length > 0) {
            drawnItems.openPopup();
        }
    });