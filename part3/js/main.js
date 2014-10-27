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

    $('#geolocation').click(function() {

        var position = geolocation.getPosition();

        var point = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [new ol.Feature({
                    geometry: new ol.geom.Point(position)
                })]
            })
        });

        map.addLayer(point);

        view.setCenter(position);
        view.setResolution(2.388657133911758);
        return false;
    });

});