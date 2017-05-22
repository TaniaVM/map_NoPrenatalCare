 



var layer = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});


  var top5arr = [];
  var bottom5arr = [];

  var myZoom = 2;
  //now the fun stuff:  leaflet!
  var map1 = L.map('map1').setView( [43.0481, -76.1474], 6); 
    map1.addLayer(layer)
      


$('#ex1').slider({
  formatter: function(value) {
    return 'Value: ' + value;
  }
});


  var geojson;

  //this function takes a value and returns a color based on which bucket the value falls between
  function getColor(crimes) {
      return crimes > 10 ? '#800026' :
             crimes > 8  ? '#BD0026' :
             crimes > 5  ? '#E31A1C' :
             crimes > 1  ? '#FD8D3C' :

                        '#FED976';
  }

  var legend = L.control({position: 'topright'});
  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 5, 8, 10],
          labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] +  '<br>' : '+');
      }
      return div;
  };

  legend.addTo(map1);

  var mapColorType = "Average";
  //this function returns a style object, but dynamically sets fillColor based on the data
  function style(feature) {

    return {
        fillColor: getColor(feature.properties[mapColorType]),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '0',
        fillOpacity: 0.6
    };
  }

  function changeType(){
    var type = $('#dropDown :selected').val();

    if(mapColorType != type) {
      mapColorType = type;
        $.getJSON('data/Percentage2014.geojson', function(state_data) {
          console.log(state_data);
          geojson = L.geoJson(state_data,{
            style: style, 
            onEachFeature: onEachFeature
          }).addTo(map1);
        });
    }
  }
  //this function is set to run when a user mouses over any polygon
  function mouseoverFunction(e) {
    var layer = e.target;
    var feature = layer.feature;

    layer.setStyle({
        weight: 5,
        opacity: 1,
        color: '#fff',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    //update the text in the infowindow with whatever was in the data
    console.log(feature);


    $('#infoWindow').html('<br>' + 'County: ' + layer.feature.properties.NAME+ '<h3>'+ layer.feature.properties[mapColorType] + '<br>' + '</h3>'+ '<br>'  + 'Percentage by County'); 

  }

  //this runs on mouseout
  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  //this is executed once for each feature in the data, and adds listeners
  function onEachFeature(feature, layer) {
    var cattype = $('#dropDown :selected').val();
    top5arr.push(feature.properties[mapColorType]);

    layer.on({
        mouseover: mouseoverFunction,
        mouseout: resetHighlight
 
    });
  }


  //specify style and onEachFeature options when calling L.geoJson().
  //adding data from my geojson file
  $.getJSON('data/Percentage2014.geojson', function(state_data) {
    console.log(state_data);
    geojson = L.geoJson(state_data,{
      style: style, 
      onEachFeature: onEachFeature
    }).addTo(map1);
  });


