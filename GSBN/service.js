// -------------------------------------------------------------------
var wherefromlat;
var wherefromlng;
var wheretolat;
var wheretolng;
var mapOptions;
var directionsService;
var directionsRenderer;

var generatedRouteList;
var instructionsList;
var routeListAbstract = [];
var boxcontent;

function submitForm(event) {
    event.preventDefault(); // Prevent the default form submission

    button = document.getElementById('submit')
    if(button.value == "이전으로")
    {var url = "index.html"}
    else{
      var url = "input.html"
    }
    window.location.href = url;
}

class Path {
    constructor(startlocation, endlocation, transportmode, modeoftransit, duration) {
      this.startlocation = startlocation;
      this.endlocation = endlocation;
      this.transportmode = transportmode;
      this.modeoftransit = modeoftransit;
      this.duration = duration;
      this.canbereached = true;
    }
};

function initialize() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    var seoul = new google.maps.LatLng(37.566667, 126.97840);
    mapOptions = {
        zoom: 15,
        center: seoul
    };

    setlocations();

    calcRoute();
  }
  
function setlocations() {
    var params = new URLSearchParams(window.location.search);
    wherefromlat = params.get('wherefromlat');
    wherefromlng = params.get('wherefromlng');
    wheretolat = params.get('wheretolat');
    wheretolng = params.get('wheretolng');
}

function calcRoute() {
    var start = new google.maps.LatLng(wherefromlat, wherefromlng);
    var end = new google.maps.LatLng(wheretolat, wheretolng);
    var routetime = new Date();
    var request = {
        origin: start,
        destination: end,
        travelMode: 'TRANSIT',
        transitOptions: {
            departureTime: routetime,
        },
        region: 'KR',
        provideRouteAlternatives: true
    };
    
    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
        generatedRouteList = result;
        console.log(result);
        extractRouteInfo();
        evaluateRoutes();

        instructionsList = textifyRoutes();        
            for (let i = 0; i < instructionsList.length; i++) {
                genBox(instructionsList[i], i);
            }
        }
        getfirebase();

    });
}

function textifyRoutes() {
    let routelist = generatedRouteList.routes;
    let routeinstructionslist = [];
    for (let i = 0; i < routelist.length; i++) {
        let routeinstructions = '';
        let routesteplist = generatedRouteList.routes[i].legs[0].steps
        for (let j = 0; j < routesteplist.length; j++){
            if(generatedRouteList.routes[i].legs[0].steps[j].travel_mode == 'TRANSIT'){
                let isbus = (generatedRouteList.routes[i].legs[0].steps[j].instructions)
                routeinstructions += generatedRouteList.routes[i].legs[0].steps[j].transit.departure_stop.name
                if(isbus.startsWith("버스", 0, 2)){
                    routeinstructions += " 정류장에서 "
                }
                else{
                    routeinstructions += "역에서 "
                }
                routeinstructions += generatedRouteList.routes[i].legs[0].steps[j].transit.arrival_stop.name
                if(isbus.startsWith("버스", 0, 2)){
                    routeinstructions += " 정류장으로 이동 "
                }
                else{
                    routeinstructions += "역으로 이동 "
                }
            }
            else{
                routeinstructions += generatedRouteList.routes[i].legs[0].steps[j].instructions
                routeinstructions += " "
            }
            if(j != routesteplist.length - 1){
                routeinstructions += '\u2192 '
            }
        }
        routeinstructionslist.push(routeinstructions);
    }
    return routeinstructionslist;
}

function genBox(text, num) {
    var parentContainer = document.createElement('div');
    parentContainer.setAttribute('id', 'routeViewerBox');
    var textContainer = document.createElement('div');
    textContainer.setAttribute('class', 'textContainer');
    parentContainer.appendChild(textContainer);
    var textNode = document.createTextNode(text);
    parentContainer.appendChild(textNode);
    textContainer.appendChild(textNode);
    var childContainer = document.createElement('div');
    childContainer.setAttribute('class', 'routeSelectButton');
    childContainer.setAttribute('id', num);
    parentContainer.appendChild(childContainer);
    var buttonText = document.createTextNode('선택');
    childContainer.appendChild(buttonText);
    var targetElement = document.getElementById('inputConsole');
    targetElement.appendChild(parentContainer);
    childContainer.addEventListener('click', function() {
        generatemap(num);
    });
}

function getfirebase(){
  let boxb = document.getElementsByClassName('textContainer')[3];
  boxb.textContent = boxcontent;
  boxb.style.color = 'blue';
}

function generatemap(num){
    var targetElement = document.getElementById('inputConsole');
    while (targetElement.firstChild) {
        targetElement.removeChild(targetElement.firstChild);
    }
    var mapbox = document.createElement('div');
    mapbox.setAttribute('id', 'map');
    mapbox.style.height = '75vh';
    map = new google.maps.Map(mapbox, mapOptions);
    directionsRenderer.setMap(map);
    directionsRenderer.setDirections(generatedRouteList);
    directionsRenderer.setRouteIndex(num);
    targetElement.appendChild(mapbox);

    var button = document.getElementById('submit');
    button.value = "안내 종료";
}

//----------------------------------------------------------------------------------------------

function extractRouteInfo(){
    let routelist = generatedRouteList.routes;
    for (let i = 0; i < routelist.length; i++) {
            let routeabstractlist = [];
            let routesteplist = generatedRouteList.routes[i].legs[0].steps
            for (let j = 0; j < routesteplist.length; j++){
                let startlocation, endlocation, modeoftransport, modeoftransit, duration;
                startlocation = generatedRouteList.routes[i].legs[0].steps[j].start_location;
                endlocation = generatedRouteList.routes[i].legs[0].steps[j].end_location;
                modeoftransport = generatedRouteList.routes[i].legs[0].steps[j].travel_mode;
                duration = generatedRouteList.routes[i].legs[0].steps[j].duration.value;
                if(modeoftransport == 'TRANSIT'){
                    modeoftransit = generatedRouteList.routes[i].legs[0].steps[j].transit.line.vehicle.type;
                }
                else{
                    modeoftransit = 'None'
                }
                let step = new Path(startlocation, endlocation, modeoftransport, modeoftransit, duration);
                routeabstractlist.push(step);
            }
        routeListAbstract.push(routeabstractlist);
    }
};

async function evaluateRoutes() {
    for (let i = 0; i < routeListAbstract.length; i++) {
      let time = new Date();
      let goOn = true;
      if (goOn) {
        for (let j = 0; j < routeListAbstract[i].length; j++) {
          if (routeListAbstract[i][j].transportmode === 'TRANSIT') {
            await performTransitCheck(routeListAbstract[i][j], time);
            if (!routeListAbstract[i][j].canbereached) {
              goOn = false;
              break;
            }
          } else {
            addSecondsToDate(time, routeListAbstract[i][j].duration);
          }
        }
      }
    }
    console.log(routeListAbstract);
  }
  
  async function performTransitCheck(step, time) {
    const directions = new google.maps.DirectionsService();
    const requests = {
      origin: step.startlocation,
      destination: step.endlocation,
      travelMode: 'TRANSIT',
      transitOptions: {
        departureTime: time,
        modes: [step.modeoftransit],
        routingPreference: 'FEWER_TRANSFERS',
      },
      region: 'KR',
      provideRouteAlternatives: false,
    };
  
    return new Promise((resolve, reject) => {
      directions.route(requests, async function (result, status) {
        if (status === 'OK') {
            const dateString = result.routes[0].legs[0].departure_time.value;
          const dateObject = new Date(dateString);
          if (await compareAfterAdding2Hours(time, dateObject)) {
            step.canbereached = false;
          } else {
            let transitduration = result.routes[0].legs[0].duration.value;
            addSecondsToDate(time, transitduration);
          }
          resolve();
        } else {
          reject(new Error('Transit directions request failed'));
        }
      });
    });
  }
  
  function addSecondsToDate(date, seconds) {
    date.setTime(date.getTime() + seconds * 1000);
  }
  
  async function compareAfterAdding2Hours(time1, time2) {
    const twoHoursInSeconds = 2 * 60 * 60;
    const futureTime = new Date(time1.getTime() + twoHoursInSeconds * 1000);
    return futureTime < time2;
  }  
        
function editRoutes(){

};

//-------------------------------------------- Do not touch ---------------------------

