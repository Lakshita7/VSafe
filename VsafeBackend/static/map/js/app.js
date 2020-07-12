

/**
 * Calculates and displays a car route from the Brandenburg Gate in the centre of Berlin
 * to Friedrichstraße Railway Station.
 *
 * A full list of available request parameters can be found in the Routing API documentation.
 * see:  http://developer.here.com/rest-apis/documentation/routing/topics/resource-calculate-route.html
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */
function calculateRouteFromAtoB(platform) {
  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: 'fastest;car',
      representation: 'display',
      routeattributes: 'waypoints,summary,shape,legs',
      maneuverattributes: 'direction,action',
      waypoint0: '12.8448,77.6632', // Brandenburg Gate
      waypoint1: '12.9343,77.6112'  // Friedrichstraße Railway Station
    };
  router.calculateRoute(
    routeRequestParams,
    onSuccess,
    onError
  );
}
/**
 * This function will be called once the Routing REST API provides a response
 * @param  {Object} result          A JSONP object representing the calculated route
 *
 * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
 */
function onSuccess(result) {
  var route = result.response.route[0];
  /*
   * The styling of the route response on the map is entirely under the developer's control.
   * A representitive styling can be found the full JS + HTML code of this example
   * in the functions below:
   */
  addRouteShapeToMap(route);
  addManueversToMap(route);

  addWaypointsToPanel(route.waypoint);
  addManueversToPanel(route);
  addSummaryToPanel(route.summary);
  // ... etc.
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  alert('Ooops!');
}




/**
 * Boilerplate map initialization code starts below:
 */

// set up containers for the map  + panel
var mapContainer = document.getElementById('heremap'),
  routeInstructionsContainer = document.getElementById('panel');

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
  app_id: 'ujczkt8ECGodKikNVXqG',
  app_code: 'hQJUrs4q485l4Qx416ev7w',
  useCIT: true,
  useHTTPS: true
});
var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});
//Step 2: initialize a map - this map is centered over Berlin
var map = new H.Map(mapContainer,
  defaultLayers.normal.map, {
    center: { lat: 12.9716, lng: 77.5946 },
    zoom: 13
  });

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Hold a reference to any infobubble opened
var bubble;

/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, text) {
  if (!bubble) {
    bubble = new H.ui.InfoBubble(
      position,
      // The FO property holds the province name.
      { content: text });
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}


/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(route) {
  var strip = new H.geo.Strip(),
    routeShape = route.shape,
    polyline;

  routeShape.forEach(function (point) {
    var parts = point.split(',');
    strip.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(strip, {
    style: {
      lineWidth: 4,
      strokeColor: 'rgba(0, 128, 255, 0.7)'
    }
  });
  // Add the polyline to the map
  map.addObject(polyline);
  // And zoom to its bounding rectangle
  map.setViewBounds(polyline.getBounds(), true);
}


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToMap(route) {
  var svgMarkup = '<svg width="18" height="18" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="8" cy="8" r="8" ' +
    'fill="#1b468d" stroke="white" stroke-width="1"  />' +
    '</svg>',
    dotIcon = new H.map.Icon(svgMarkup, { anchor: { x: 8, y: 8 } }),
    group = new H.map.Group(),
    i,
    j;

  // Add a marker for each maneuver
  for (i = 0; i < route.leg.length; i += 1) {
    for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];
      // Add a marker to the maneuvers group
      var marker = new H.map.Marker({
        lat: maneuver.position.latitude,
        lng: maneuver.position.longitude
      },
        { icon: dotIcon });
      marker.instruction = maneuver.instruction;
      group.addObject(marker);
    }
  }

  group.addEventListener('tap', function (evt) {
    map.setCenter(evt.target.getPosition());
    openBubble(
      evt.target.getPosition(), evt.target.instruction);
  }, false);

  // Add the maneuvers group to the map
  map.addObject(group);
}


/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addWaypointsToPanel(waypoints) {



  var nodeH3 = document.createElement('h3'),
    waypointLabels = [],
    i;


  for (i = 0; i < waypoints.length; i += 1) {
    waypointLabels.push(waypoints[i].label)
  }

  nodeH3.textContent = waypointLabels.join('');

  routeInstructionsContainer.innerHTML = '';
  //console.log(nodeH3);
  routeInstructionsContainer.appendChild(nodeH3);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addSummaryToPanel(summary) {
  var summaryDiv = document.createElement('div'),
    content = '';
  content += '<b>Total distance</b>: ' + summary.distance + 'm. <br/>';
  content += '<b>Travel Time</b>: ' + summary.travelTime.toMMSS() + ' (in current traffic)';
  summaryDiv.style.fontSize = 'small';
  summaryDiv.style.marginLeft = '5%';
  summaryDiv.style.marginRight = '5%';
  summaryDiv.innerHTML = content;
  //console.log(content);
  routeInstructionsContainer.appendChild(summaryDiv);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToPanel(route) {

  var nodeOL = document.createElement('ol'),
    i,
    j;

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft = '5%';
  nodeOL.style.marginRight = '5%';
  nodeOL.className = 'directions';

  // Add a marker for each maneuver
  for (i = 0; i < route.leg.length; i += 1) {
    for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];

      var li = document.createElement('li'),
        spanArrow = document.createElement('span'),
        spanInstruction = document.createElement('span');

      spanArrow.className = 'arrow ' + maneuver.action;
      spanInstruction.innerHTML = maneuver.instruction;
      console.log();
      li.appendChild(spanArrow);
      li.appendChild(spanInstruction);

      nodeOL.appendChild(li);
    }
  }
  console.log(nodeOL);
  routeInstructionsContainer.appendChild(nodeOL);
}

function setUpClickListener(map) {
  // Attach an event listener to map display
  // obtain the coordinates and display in an alert box.
  map.addEventListener('tap', function (evt) {
    var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);
    alert('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
        ((coord.lat > 0) ? 'N' : 'S') +
        ' ' + Math.abs(coord.lng.toFixed(4)) +
         ((coord.lng > 0) ? 'E' : 'W'));
  });
}

function addPolylineToMap(map) {
  var lineString = new H.geo.LineString();

  lineString.pushPoint({lat: 12.8576, lng:77.6627});
  lineString.pushPoint({lat:12.8623,  lng:77.6487});
  lineString.pushPoint({lat:12.8666, lng:77.6522});
  lineString.pushPoint({lat:12.8692, lng:77.6535});

  map.addObject(new H.map.Polyline(
    lineString, { style: {
                            lineWidth: 4 ,
                            strokeColor: 'rgba(214, 69, 65, 1)'}}
  ));
}

Number.prototype.toMMSS = function () {
  return Math.floor(this / 60) + ' minutes ' + (this % 60) + ' seconds.';
}

function addSVGMarkers(map){
  //Create the svg mark-up
  var svgMarkup = '<svg  width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
  '<rect stroke="black" fill="${FILL}" x="1" y="1" width="22" height="22" />' +
  '<text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
  'text-anchor="middle" fill="${STROKE}" >4</text></svg>';
  var svgMarkup1 = '<svg  width="24" height="24" xmlns="http://www.w3.org/2000/svg">' +
  '<rect stroke="black" fill="${FILL}" x="1" y="1" width="22" height="22" />' +
  '<text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" ' +
  'text-anchor="middle" fill="${STROKE}" >2.5</text></svg>';
  // Add the first marker
  var bearsIcon = new H.map.Icon(
    svgMarkup.replace('${FILL}', 'white').replace('${STROKE}', 'red')),
    bearsMarker = new H.map.Marker({lat: 12.9202, lng: 77.621 },
      {icon: bearsIcon});
  map.addObject(bearsMarker);
  //Add the second marker.
  var cubsIcon = new H.map.Icon(
    svgMarkup1.replace('${FILL}', 'white').replace('${STROKE}', 'red')),
    cubsMarker = new H.map.Marker({lat: 12.8643, lng: 77.6524 },
      {icon: cubsIcon});
  map.addObject(cubsMarker);
}








setUpClickListener(map);
calculateRouteFromAtoB(platform);
addPolylineToMap(map);
addSVGMarkers(map);
