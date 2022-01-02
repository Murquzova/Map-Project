jQuery('.datetimepicker').datetimepicker({
  format: 'Y-m-d H:m:s',
});

locationsdata = [
  {
    id: 1,
    Time: '2021-12-01 22:38:27',
    Location: '40.3806, 49.6756',
  },
  {
    id: 2,
    Time: '2021-12-14 22:49:53',
    Location: '40.45651, 49.87394',
  },
  {
    id: 3,
    Time: '2021-12-02 23:50:18',
    Location: '40.3609, 49.86756',
  },
  {
    id: 4,
    Time: '2021-12-31 05:50:18',
    Location: '40.3000, 49.66756',
  },
];

function sortFunction(a, b) {
  var dateA = new Date(a.Time).getTime();
  var dateB = new Date(b.Time).getTime();
  return dateA > dateB ? 1 : -1;
}
locationsdata.sort(sortFunction);
// console.log(locationsdata);

var mapMarkers = [];
var polylineCoordinates = [];
let bool = false;
let line_bool = false;
var line = [];

function initMap() {
  var element = document.getElementById('map');
  var options = {
    zoom: 11,
    center: { lat: 40.3909, lng: 49.86756 },
  };
  var map = new google.maps.Map(element, options);

  $('button').click(function () {
    //delete
    if (bool) {
      mapMarkers.forEach((marker) => {
        marker.setMap(null);
      });
    }
    if (line_bool) {
      line.forEach((a) => {
        a.setMap(null);
      });
      line = [];
    }

    $('.add').html('');
    from = $('#from').val();
    to = $('#to').val();

    locationsdata.forEach((item) => {
      //  console.log( item.Time.split(' '))

      let mass = item.Location.split(',');
      if (dateCheck(from, to, item.Time)) {
        $('.add').append(`
          <p>${item.Time} ${item.Location}  </p>
          `);
        options = {
          zoom: 11,
          center: { lat: parseFloat(mass[0]), lng: parseFloat(mass[1]) },
        };
        marker = new google.maps.Marker({
          position: options.center,
          map: map,
          animation: google.maps.Animation.BOUNCE,
        });
        mapMarkers.push(marker);
      }
    });
    bool = true;
    polylineCoordinates = [];
  });

  $('.arrow').click(function () {
    from = $('#from').val();
    to = $('#to').val();

    locationsdata.forEach((item) => {
      let mass = item.Location.split(',');
      if (dateCheck(from, to, item.Time)) {
        options = {
          center: { lat: parseFloat(mass[0]), lng: parseFloat(mass[1]) },
        };
        polylineCoordinates.push(options.center);
      }
      const flightPath = new google.maps.Polyline({
        map: map,
        path: polylineCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [
          {
            icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
            offset: '100%',
          },
        ],
      });

      line.push(flightPath);
    });
    line_bool = true;
  });
}

function dateCheck(from, to, check) {
  var dateFrom = Date.parse(from);
  var dateTo = Date.parse(to);
  var dateCheck = Date.parse(check);
  if (dateCheck <= dateTo && dateCheck >= dateFrom) {
    return true;
  }
  return false;
}
