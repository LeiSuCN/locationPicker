(function($,Map){

	function LocationPicker( containerId, opts ){

		var _this = this;

		var _opts = {};
		$.extend(_opts, {
			pick:function(point){
				console.log( point.lng + ', ' + point.lat );
			},
			enableClick: true,
			enableSearch: true,
			mouseCursor: 'crosshair',
			center: { lat:114.086788, lon:22.546967 },
			zoom: 11
		}, opts);


		var _m = new Map.Map(containerId, {
			//resizeEnable: true,
			//rotateEnable: true,
			dragEnable: true,
			zoomEnable: true,
			//设置可缩放的级别
			//zooms: [3,18],
			//传入2D视图，设置中心点和缩放级别
			view: new Map.View2D({
				center: new Map.LngLat(_opts.center.lat, _opts.center.lon),
				zoom: _opts.zoom
			})
		});				

		// cursor style
		_m.setDefaultCursor(_opts.mouseCursor);

		// for the click event
		if( _opts.enableClick ){
			Map.event.addListener(_m, "click", function(e){
				_this.pick(e.lnglat);
			});
		}		

		// private members
		this._m = _m;
		this._opts = _opts;

		// add autocomplete
		if( _opts.enableSearch ){
			//this.addAutocomplete();
		}
	}


	LocationPicker.prototype.version = function() {
		
	};

	LocationPicker.prototype.addAutocomplete = function() {

	};

	LocationPicker.prototype.pick = function(point) {

		this._m.clearMap();
		var marker = new AMap.Marker({				  
			icon:"http://js.webapi.amap.com/theme/v1.3/markers/n/mark_rs.png",
			position: point
		});
		marker.setMap(this._m);  //在地图上添加点
		if( this._opts.pick )
			this._opts.pick(point)
		
	};

	LocationPicker.prototype.setCenter = function() {

		if( arguments )
		{
			if( arguments.length == 1){ // setCenter(point)
				this._m.setCenter(arguments[0]);
			}
			else if( arguments.length == 2){ // setCenter(lng, lat)
				var point = new Map.LngLat(arguments[0], arguments[1]);
				this._m.setCenter(point);
			}
		}
	};

	LocationPicker.prototype.setZoom = function(zoom) {
		this._bm.setZoom(zoom);
	};


	top.window.LocationPicker = top.window.LocationPicker || LocationPicker;

})(jQuery,AMap)