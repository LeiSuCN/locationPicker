(function($,BMap){

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
			center: "深圳",
			zoom: 12
		}, opts);


		var _bm = new BMap.Map(containerId);
		_bm.centerAndZoom(_opts.center,_opts.zoom);

		// cursor style
		_bm.setDefaultCursor(_opts.mouseCursor);

		// wheel zoom
		_bm.enableScrollWheelZoom();
		_bm.enableContinuousZoom();

		// for the click event
		if( _opts.enableClick ){
			_bm.addEventListener("click", function(e){
				_this.pick(e.point);
			});
		}		

		// private members
		this._bm = _bm;
		this._opts = _opts;

		// add autocomplete
		if( _opts.enableSearch ){
			this.addAutocomplete();
		}
	}


	LocationPicker.prototype.version = function() {
		
	};

	LocationPicker.prototype.addAutocomplete = function() {

		var map = this._bm;

		function AutocompleteControl(){
			this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
			this.defaultOffset = new BMap.Size(10,10);
		}

		AutocompleteControl.prototype = new BMap.Control();

		AutocompleteControl.prototype.initialize = function(map) {

			//<div id="r-result">请输入:<input type="text" id="suggestId" size="20" value="百度" style="width:150px;" /></div>

			var div = document.createElement('div');
			div.setAttribute('id', 'r-result');

			var input = document.createElement('input');
			input.setAttribute('id','suggestId');
			input.setAttribute('type','text');
			input.setAttribute('placeholder', '搜索');
			input.style.width = '240px';
			div.appendChild( input );

			map.getContainer().appendChild(div);
			return div;
		};

		var ctrl = new AutocompleteControl();
		map.addControl( ctrl );

		var ac = new BMap.Autocomplete({
			"input" : "suggestId"
			,"location" : map
		});

		var _this = this;
		ac.addEventListener("onconfirm", function(e) {
			var _value = e.item.value;
			var searchValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;

			var local = new BMap.LocalSearch(map, {
		  		onSearchComplete: function(){
		  			var point = local.getResults().getPoi(0).point;
		  			_this.pick(point)
		  		}
			});
			local.search(searchValue);
		});

	};

	LocationPicker.prototype.pick = function(point) {

		this._bm.clearOverlays();
		this._bm.addOverlay(new BMap.Marker(point)); 

		if( this._opts.pick )
			this._opts.pick(point)
		
	};

	LocationPicker.prototype.setCenter = function() {

		if( arguments )
		{
			if( arguments.length == 1){ // setCenter(point)
				this._bm.setCenter(arguments[0]);
			}
			else if( arguments.length == 2){ // setCenter(lng, lat)
				var point = new BMap.Point(arguments[0], arguments[1]);
				this._bm.setCenter(point);
			}
		}
	};

	LocationPicker.prototype.setZoom = function(zoom) {
		this._bm.setZoom(zoom);
	};


	top.window.LocationPicker = top.window.LocationPicker || LocationPicker;

})(jQuery,BMap)