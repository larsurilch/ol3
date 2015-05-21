
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
		var endereco = $('#endereco').val();

		if(endereco) {
			$.ajax({
				type: 'GET',
				url: 'http://nominatim.openstreetmap.org/search/' + endereco + '?format=json',
				dataType: 'json'
			}).done(function(response) {
				if(response[0] != undefined) {
					var bbox = response[0].boundingbox;
					var order = [parseFloat(bbox[2]), parseFloat(bbox[0]), parseFloat(bbox[3]), parseFloat(bbox[1])];
					var extent = ol.extent.applyTransform(order, ol.proj.getTransform('EPSG:4326', 'EPSG:3857'));
					map.getView().fitExtent(extent, map.getSize());
				}
			}).fail(function(jqXHR, textStatus) {
				alert('Ocorreu o seguinte erro:' + textStatus);
			});
		}
	});

});
