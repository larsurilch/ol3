var img;
var param_2016 = 'datageo:DensidadeDemografica2016';
var param_2015 = 'datageo:DensidadeDemografica2015';

var view = new ol.View({
    center: [-5336552.138874804, -2639543.1853948906],
    zoom: 7,
    maxZoom: 18,
    minZoom: 2
});

var osm = new ol.layer.Tile({
    preload: Infinity,
    source: new ol.source.OSM(),
    name: 'osm'
});

var layer_2016 =  new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: 'http://datageo.ambiente.sp.gov.br/geoserver/datageo/wms',
        params: {'layers':param_2016, 'TILED':true},
        ratio: 1,
        serverType: 'geoserver'
    }),
    visible: true,
    name: 'layer_2016'
});

var layer_2015 =  new ol.layer.Image({
    source: new ol.source.ImageWMS({
        url: 'http://datageo.ambiente.sp.gov.br/geoserver/datageo/wms',
        params: {'layers':param_2015, 'TILED':true},
        ratio: 1,
        serverType: 'geoserver'
    }),
    visible: false,
    name: 'layer_2015'
});

var map = new ol.Map({
    target: 'map',
    controls: ol.control.defaults({attribution:false}).extend([
        new ol.control.ScaleLine(),
        new ol.control.ZoomSlider()
    ]),
    renderer: 'canvas',
    layers: [osm, layer_2016, layer_2015],
    view: view
});

$('#layers input[type=radio]').change(function() {
    var layer = $(this).val();

    map.getLayers().getArray().forEach(function(e) {
        var name = e.get('name');
        if(name != 'osm')
            e.setVisible(name == layer);
    });
});

$('button').click(function() {
    map.getLayers().getArray().forEach(function(e) {
        var name = e.get('name');

        if(e.getVisible() && name != 'osm') {
            if(name == 'layer_2016') {
                img = param_2016;
            } else {
                img = param_2015;
            }
        }

        $('#legend').empty().html('<img src="http://datageo.ambiente.sp.gov.br/geoserver/datageo/wms?REQUEST=GetLegendGraphic&VERSION=1.1.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + img + '&bbox=-124.73142200000001,24.955967,-66.969849,49.371735&srcwidth=768&srcheight=330&srs=EPSG:4326&legend_options=countMatched:true;fontAntiAliasing:true">');
    });
});