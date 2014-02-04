// Test jquery call to cartodb backend
//   * LIMIT 1
//   * Check content of result
asyncTest( "fetch data limit 1", 1, function() {
    var result = fetchTrackingData("https://lifewatch-inbo.cartodb.com/api/v2/sql?q=SELECT%20cartodb_id,%20date_time,%20day_of_year,%20ST_Distance_Sphere(the_geom,%20ST_GeomFromText('POINT(3.182863%2051.3407476)',%204326))%20as%20distance_from_nest_in_meters%20FROM%20tracking_eric%20ORDER%20BY%20date_time", " LIMIT 1");
    var expectedResult = {
        "time":0.05,
        "fields":{
            "cartodb_id":{"type":"number"},
            "date_time":{"type":"date"},
            "day_of_year":{"type":"number"},
            "distance_from_nest_in_meters":{"type":"number"}
        },
        "total_rows":1,
        "rows":[
            {
                "cartodb_id":1517,
                "date_time":"2013-06-01T00:01:09Z",
                "day_of_year":152,
                "distance_from_nest_in_meters":5881.892200839
            }
        ]
    };
    result.done(function (data) {
        equal(data.rows[0].distance_from_nest_in_meters, 5881.892200839);
        start();
    })
    .fail(function () {
        ok('', 'fetch tracking data failed');
        start();
    });
});

// Test jquery call to cartodb backend
//   * count number of output rows
asyncTest( "fetch all data", 1, function() {
    var result = fetchTrackingData("https://lifewatch-inbo.cartodb.com/api/v2/sql?q=SELECT%20cartodb_id,%20date_time,%20day_of_year,%20ST_Distance_Sphere(the_geom,%20ST_GeomFromText('POINT(3.182863%2051.3407476)',%204326))%20as%20distance_from_nest_in_meters%20FROM%20tracking_eric%20ORDER%20BY%20date_time ", "");
    result.done(function (data) {
        deepEqual( data.rows.length, 25483);
        start();
    })
    .fail(function () {
        ok('', 'fetch tracking data failed');
        start();
    });
});

var testCartoDbOutput = {
    "time":0.05,
    "fields":{
	"timestamp":{"type":"number"},
	"max_distance_from_nest":{"type":"number"}
    },
    "total_rows":1,
    "rows":[
	{
	    "timestamp": 1370044800,
	    "max_distance_from_nest":5881.3
	},
	{
	    "timestamp": 4,
	    "max_distance_from_nest": 9
	}
    ]
};
// Convert to expected object type for calendar heatmap
test("convert object from cartodb to cal-heatmap input", function() {
    var calHeatmapInput = {"1370044800": 5881.3, "4": 9};
    deepEqual(toCalHeatmap(testCartoDbOutput), calHeatmapInput);
});

// Convert to expected object type for nvd3 line chart
test("convert object from cartodb to nvd3 linechart input", function() {
    var lineChartInput = [ {"key": "Maximum distance", "color": "green", "values": [ {"x": 1370044800000, "y": 5881.3}, {"x": 4000, "y": 9} ] } ];
    result = toNvd3Linedata(testCartoDbOutput);
    deepEqual(result[0].values, lineChartInput[0].values);
});

asyncTest( "fetch data aggregated by day-hour", 2, function() {
    var result = fetchTrackingData_byDayHour("Eric", "point(3.182875%2051.340768)", " LIMIT 1");
    var expectedNrOfRows = 1;
    var expectedRow = {timestamp: 1369738800, max_distance_from_nest: 0.325};
    result.done(function(data) {
	equal(data.rows.length, expectedNrOfRows);
	deepEqual(data.rows[0], expectedRow);
        start();
    })
    .fail(function () {
        ok('', 'fetch aggregated tracking data failed');
        start();
    });
});
