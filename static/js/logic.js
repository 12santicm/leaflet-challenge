// Create the map object
let myMap = L.map("map", {
    center: [37.09, -95.71], // Centered on the United States
    zoom: 5 // Initial zoom level
});

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the Earthquake Data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    // Define function to marker size and color
    function markerSize(magnitude) {
        return magnitude * 4;
    }
    // Define function to color
    function markerColor(depth) {
        if (depth > 90) return "#ea2c2c";
        else if (depth > 70) return "#ea822c";
        else if (depth > 50) return "#ee9c00";
        else if (depth > 30) return "#eecc00";
        else if (depth > 10) return "#d4ee00";
        else return "#98ee00";
    }

    // Add data to myMap
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
                "<p>Magnitude: " + feature.properties.mag + "</p>" +
                "<p>Depth: " + feature.geometry.coordinates[2] + " km</p>");
        }
    }).addTo(myMap);
    
    // Check if data works on the Console
    console.log(data);

    // Add a Legend
    let legend = L.control({position: "bottomright"});

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend"),
            grades = [-10, 10, 30, 50, 70, 90],
            colors = [
                "#98ee00",
                "#d4ee00",
                "#eecc00",
                "#ee9c00",
                "#ea822c",
                "#ea2c2c"
            ];

        
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
});
