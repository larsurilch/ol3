var accents = function(s){
    var r = s.toLowerCase();
    non_asciis = {'a': '[àáâãäå]', 'ae': 'æ', 'c': 'ç', 'e': '[èéêë]', 'i': '[ìíîï]', 'n': 'ñ', 'o': '[òóôõö]', 'oe': 'œ', 'u': '[ùúûűü]', 'y': '[ýÿ]'};
    for (i in non_asciis) { r = r.replace(new RegExp(non_asciis[i], 'g'), i); }
    return r;
};

$(document).ready(function() {

	var view = new ol.View({
		center: [-6217890.205764902, -1910870.6048274133],
		zoom: 4,
		maxZoom: 18,
		minZoom: 2
	});

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
		view: view
	});

	var wms = new ol.layer.Tile({
    	title: "Municipios",
    	source: new ol.source.TileWMS({
        	url: 'http://localhost/cgi-bin/mapserv?map=/var/www/codegeo/codegeo.map',
        	params: {
				'LAYERS': 'municipios', 
        		'TILED': true,
			},
        	serverType: 'mapserver'
      	})
  	});

  	map.addLayer(wms);

	$('#pesquisar').click(function() {
		var val_estado = $('#estado').val();
		var val_municipio = $('#municipio').val();

		var source = wms.getSource();
		var params = source.getParams();

		params.estado = accents(val_estado);
		params.municipio = accents(val_municipio);

		source.updateParams(params);
	});

});