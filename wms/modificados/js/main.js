/*
	URL - http://demo.boundlessgeo.com/geoserver/wms
	Layer - ne:ne
	Server - GeoServer
*/

$(document).ready(function() {

	var map = new ol.Map({
		target: 'mapa',
		controls: ol.control.defaults().extend([
			new ol.control.ScaleLine(),
			new ol.control.ZoomSlider()
		]),
		renderer: 'canvas',
		layers: [
			new ol.layer.Tile({
  				source: new ol.source.MapQuest({ layer: 'osm' })
			})
		],
		view: new ol.View({
			center: [-6217890.205764902, -1910870.6048274133],
			zoom: 4,
			maxZoom: 18,
			minZoom: 2
		})
	});

	$('button').click(function() {
		var url = $('#url').val();
		var layer = $('#layer').val();
		var server = $('#server').val();

		if(url && layer) {
			var wms = new ol.layer.Tile({
				source: new ol.source.TileWMS({
					url: url,
					params: {'LAYERS' : layer},
					serverType: server,
					crossOrigin: ''
				})
			});

			map.addLayer(wms);
		}
	});

});