$(document).ready(function() {

	var pointDraw;
	var vectorSource = new ol.source.Vector();
	var coordinates = $("#coordinates");
	var latitude = $("[name='latitude']");
	var longitude = $("[name='longitude']");
	var wkt = $("[name='wkt']");

	var view = new ol.View({
		center: [-6217890.205764902, -1910870.6048274133],
		zoom: 4,
		maxZoom: 18,
		minZoom: 2
	});

	var baseLayer = new ol.layer.Tile({
		source: new ol.source.MapQuest({ layer: 'osm' })
	});

	var map = new ol.Map({
		target: 'mapa',
		controls: ol.control.defaults().extend([
			new ol.control.ScaleLine(),
			new ol.control.ZoomSlider()
		]),
		renderer: 'canvas',
		layers: [baseLayer],
		view: view
	});

	$('#enviar').click(function() {
		var lat = latitude.val();
		var long = longitude.val();

		if(long != '' && lat != '') {
			vectorSource.clear();
			vectorSource.addFeature(
				new ol.Feature({
					geometry: new ol.geom.Point([parseFloat(long), parseFloat(lat)]).transform('EPSG:4326', 'EPSG:3857')
				})
			);

			wkt.val('POINT(' + long + ' ' + lat + ')');
			map.getView().fitExtent(vectorSource.getExtent(), map.getSize());
		}

		return false;
	});

	var vectorLayer = new ol.layer.Vector({
		source: vectorSource
	});

	map.addLayer(vectorLayer);

	$("#pan").click(function() {
		clearCustomInteractions();
		$(this).addClass('active');
		return false;
	});

	$("#drawPoint").click(function() {
		clearCustomInteractions();
		$(this).addClass('active');

		pointDraw = new ol.interaction.Draw({
			source: vectorSource,
			type: 'Point'
		});

		map.addInteraction(pointDraw);

		pointDraw.on('drawend', function(e) {
			var feature = e.feature;
			vectorSource.clear();
			vectorSource.addFeature(feature);
			var latLong = feature.getGeometry().getCoordinates();
			coordinates.text(ol.coordinate.toStringHDMS(ol.proj.transform(latLong, 'EPSG:3857', 'EPSG:4326')));
			generatePointWkt(feature);
		});

		return false;
	});

	$("#erasePoint").click(function() {
		clearCustomInteractions();
		$(this).addClass('active');
		vectorSource.clear();
		coordinates.empty();
		return false;
	});

	function clearCustomInteractions() {
		$("#bar").find("p").removeClass('active');
		map.removeInteraction(pointDraw);
	}

	function generatePointWkt(e) {
		var coords = ol.proj.transform(e.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
		longitude.val(coords[0]);
		latitude.val(coords[1]);

		coords.length ? wkt.val('POINT(' + coords[0] + ' ' + coords[1] + ')') : wkt.val('');

		return false;
	}

});