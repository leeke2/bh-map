var svy21 = require('svy21');
// Import the leaflet package
var L = require('leaflet');

// Creates a leaflet map binded to an html <div> with id "map"
// setView will set the initial map view to the location at coordinates
// 13 represents the initial zoom level with higher values being more zoomed in
var map = L.map('map').setView([1.3558701513290332, 103.8064757724087], 12);

let url="/holes";
fetch(url).then(response => response.json())
.then( (results) => {
    results.map((result) => {
    	result['data']
	    .map((hole) => {
	    	const coords = svy21.svy21ToWgs84(hole['*HOLE_NATN'], hole['*HOLE_NATE']);
	    	
	    	L.circleMarker(coords)
	    	.addTo(map)
			.bindPopup(
				`<a href="assets/${result['name'].replace('.ags', '.pdf')}" target="_blank">${result['name']}</a><br/>` +
				`HOLE_ID: ${hole['*HOLE_ID']}<br>` +
				`HOLE_TYPE: ${hole['*HOLE_TYPE']}<br>` +
				`HOLE_GL: ${hole['*HOLE_GL']}<br>`
			);
		});
	});
})
.catch(error => console.log('error:', error));

// Adds the basemap tiles to your web map
// Additional providers are available at: https://leaflet-extras.github.io/leaflet-providers/preview/
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
{
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 21
}).addTo(map);

// Adds a popup marker to the webmap for GGL address
// L.circleMarker([43.659752, -79.378161]).addTo(map)
// 	.bindPopup(
// 		'MON 304<br>' + 
// 		'Monetary Times Building<br>' +
// 		'341 Victoria Street<br>' + 
// 		'Toronto, Ontario, Canada<br>' +
// 		'M5B 2K3<br><br>' + 
// 		'Tel: 416-9795000 Ext. 5192'
// 	)
// 	.openPopup();

(function(){
    var originalInitTile = L.GridLayer.prototype._initTile
    L.GridLayer.include({
        _initTile: function (tile) {
            originalInitTile.call(this, tile);

            var tileSize = this.getTileSize();

            tile.style.width = tileSize.x + 1 + 'px';
            tile.style.height = tileSize.y + 1 + 'px';
        }
    });
})()
