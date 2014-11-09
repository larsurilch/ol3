$(document).ready(function() {

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

	var geolocation = new ol.Geolocation({
		projection: view.getProjection(),
		tracking: true
	});

	var style = new ol.style.Style({
	    image: new ol.style.Circle({
	    	radius: 7,
	      	stroke: new ol.style.Stroke({
		      	color: '#2980B9',
		      	width: 3
	    	}),
	      	fill: new ol.style.Fill({
	        	color: 'rgba(52, 152, 219, 0.3)'
	      	})
	    })
  	});

	$('#geolocation').click(function() {
		var position = geolocation.getPosition();

		var point = new ol.layer.Vector({
			source: new ol.source.Vector({
				features: [
					new ol.Feature({
						geometry: new ol.geom.Point(position),
						text: 'Minha localização é <br>'
					})
				]
			}),
			style: style
		});

		map.addLayer(point);

		view.setCenter(position);
		view.setResolution(2.388657133911758);
		return false;

	});

	var element = $('#popup');

	var popup = new ol.Overlay({
  		element: element,
  		stopEvent: false
	});

	map.addOverlay(popup);

	map.on('click', function(evt) {
		
		var feature = map.forEachFeatureAtPixel(evt.pixel,
			function(feature, layer) {
				return feature;
			});

		if (feature) {
			var coordinate = feature.getGeometry().getCoordinates();
			element.show();
			element.html(feature.get('text') + ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326')));
			popup.setPosition(coordinate);
		} else {
			element.hide();
		}

	});

});