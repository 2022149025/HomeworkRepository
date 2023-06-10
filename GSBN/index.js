//---------------------------- variables -----------------------------

let map; //departure

let map2; //arrival

let mapOptions; //default location for the maps ()

// ------------------ Map initialization -----------------
function initialize() {
    mapOptions = {
      center: new google.maps.LatLng(37.566667, 126.978406),
      zoom: 18,
      scrollwheel: true,
      fullscreenControl: false,
      streetViewControl: false,
      keyboardShortcuts: false
    };
  
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    map2 = new google.maps.Map(document.getElementById('map2'), mapOptions);
  
    showCurrentLocation(map); //sets initial location to yours
  }
  
  // Add event listener to initialize Autocomplete on page load
  window.addEventListener('load', initAutocomplete);
  
  //장소 검색창 자동완성
  function initAutocomplete() {
      var input = document.getElementById('autocompleteInput');
      var autocomplete = new google.maps.places.Autocomplete(input);
  
      var input2 = document.getElementById('autocompleteInput2');
      var autocomplete2 = new google.maps.places.Autocomplete(input2);
  
      var options = {
        componentRestrictions: { 
          country: 'KR',
        }
      }; // Set country restrictions (Korea only)
      autocomplete.setOptions(options);
      autocomplete2.setOptions(options);
  
      autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
          }
          // If the place has a geometry, then present it on a map.
          map2.setCenter(place.geometry.location);
          map2.setZoom(17);
        });
        
      autocomplete2.addListener("place_changed", () => {
        const place = autocomplete2.getPlace();
        if (!place.geometry || !place.geometry.location) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }
        // If the place has a geometry, then present it on a map.
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      });
  }

// ------------------------- input ------------------------

//Handle starting location Input
var checkboxchecked = false;
function toggleInput() {
    var checkbox;
    var fromwhereInput;

    if(!checkboxchecked){
        checkboxchecked = true;
        checkbox = document.getElementsByName("starthere")[0];
        fromwhereInput = document.getElementsByName("off")[0];
    } else{
        checkboxchecked = false;
        checkbox = document.getElementsByName("off")[0];
        fromwhereInput = document.getElementsByName("starthere")[0];
        showCurrentLocation(map);
    }

    if (checkbox.checked) {
        fromwhereInput.setAttribute("name", "off");
        checkbox.setAttribute("name", "starthere");
        fromwhereInput.removeAttribute("required");
        fromwhereInput.setAttribute("placeholder", "출발지 : 현재 위치")
        fromwhereInput.style.backgroundColor = "#cccccc"; 
        fromwhereInput.disabled = true;
    } else {
        fromwhereInput.setAttribute("name", "starthere");
        checkbox.setAttribute("name", "off");
        fromwhereInput.setAttribute("required", "required");
        fromwhereInput.setAttribute("placeholder", "출발지를 검색하세요")
        fromwhereInput.style.backgroundColor = "#ffffff"; 
        fromwhereInput.disabled = false;
    }
}

// ----------------------- design -------------------------------
document.addEventListener("DOMContentLoaded", function() {
    function updateLinePosition() {
        var mapCenter1 = document.getElementById("mapcenter1");
        var mapCenter2 = document.getElementById("mapcenter2");
        var connectingLine = document.getElementById("connectingLine");
    
        if (mapCenter1 && mapCenter2 && connectingLine) {
            var rect1 = mapCenter1.getBoundingClientRect();
            var rect2 = mapCenter2.getBoundingClientRect();

            var lineTop = (rect1.top + rect1.bottom) / 2;
            var lineBottom = (rect2.top + rect2.bottom) / 2;
            
            connectingLine.style.top = lineTop + "px";
            connectingLine.style.bottom = (lineBottom + 2) + "px";
            connectingLine.style.height = (lineBottom - lineTop - 10) + "px";
        }
  }  

  // Call the updateLinePosition function initially
  updateLinePosition();

  // Add an event listener for window resize
  window.addEventListener("resize", updateLinePosition);
});

  //사용자 입력을 저장합니다.
function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission
    var center = map.getCenter();
    var center2 = map2.getCenter();

    var url = "service.html?wherefromlat=" + center.lat() + "&wherefromlng=" + center.lng() + "&wheretolat=" + center2.lat() + "&wheretolng=" + center2.lng();
    window.location.href = url;
}