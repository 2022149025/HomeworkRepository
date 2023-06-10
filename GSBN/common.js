//script for GSBN service

//-------------------------- functions --------------------------
  
// 현재 위치 가져오기
function getCurrentLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        callback(latitude, longitude);
      },
      function (error) {
        console.error('Error getting current location:', error);
        callback(-1, -1);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
    callback(-1, -1);
  }
}

//현위치 표시하기
function showCurrentLocation(onthis) {
  getCurrentLocation(function(latitude, longitude) {
    if (latitude !== -1 && longitude !== -1) {
      onthis.setCenter(new google.maps.LatLng(latitude, longitude));
    }
  });
}

/* ------------- rain ---------- */
window.addEventListener("DOMContentLoaded", function() {
  var rainContainer = document.getElementById("rain-container");

  // Create multiple raindrops
  for (var i = 0; i < 5; i++) {
    var drop = document.createElement("div");
    drop.className = "drop";
    drop.style.left = Math.random() * 100 + "%";
    drop.style.top = 100 + "%";
    drop.style.animationDelay = Math.random() * 2 + "s";
    drop.style.opacity = (20 + Math.random() * 20) + "%";
    drop.style.height = (80 + Math.random() * 120) + "px";
    drop.style.width = (10 + Math.random() * 5) + "px";
    rainContainer.appendChild(drop);
  }
  for (var i = 0; i < 8; i++) {
      var drop = document.createElement("div");
      drop.className = "drop";
      drop.style.left = 120 + "%";
      drop.style.top = Math.random() * 120 + "%";
      drop.style.animationDelay = Math.random() * 2 + "s";
      drop.style.opacity = (20 + Math.random() * 20) + "%";
      drop.style.height = (80 + Math.random() * 120) + "px";
      drop.style.width = (10 + Math.random() * 5) + "px";
      rainContainer.appendChild(drop);
  }
  for (var i = 0; i < 4; i++) {
      var drop = document.createElement("div");
      drop.className = "drop";
      drop.style.left = 120 + "%";
      drop.style.top = (100 + Math.random() * 40) + "%";
      drop.style.animationDelay = Math.random() * 2 + "s";
      drop.style.opacity = (20 + Math.random() * 20) + "%";
      drop.style.height = (80 + Math.random() * 120) + "px";
      drop.style.width = (10 + Math.random() * 5) + "px";
      rainContainer.appendChild(drop);
  }
});