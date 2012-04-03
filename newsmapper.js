var newsMapper = (function() {
    
    // variables scoped to newsMap
	var options, sso, map, infowindow;
	
	// extend method to merge two objects
	var extend = function(obj, extObj) {
		for (var p in extObj) {
			if (extObj.hasOwnProperty(p)) {
				try {
					// Property in destination object set; update its value.
					if ( extObj[p].constructor === Object ) {
						obj[p] = extend(obj[p], extObj[p]);
						} 
					else {
						obj[p] = extObj[p];
					}
	
				}
				catch(e) {
					// Property in destination object not set; create it and set its value.
					obj[p] = extObj[p];
				}
			}
		}
		return obj;
	};
	
	// linkifies text, used to create links in description content in infowindow
	var linkify = function(text) {
		return text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function(m) {
			return m.link(m);
		});
	};
	
	// grabs json data from Google Spreadsheet
	// callback to setupMap to put data on the map
	var getSpreadsheet = function() {
		
		// cache the spreadsheet options
		sso = options.spreadsheet;
		
		// create the script element
		var script = document.createElement('script'),
			
			// create the script src with our options
			src = 'http://spreadsheets.google.com/feeds/' + sso.feedType + '/' + sso.key + '/' + sso.worksheetId + '/public/values?alt=json-in-script&callback=' + sso.callback;
		
		// set the src and append it to the head
		script.setAttribute('src', src);
		document.documentElement.firstChild.appendChild(script);
	};
	
	// sets up the map
	// this is the default callback after we get the spreadsheet data
	var setupMap = function(data) {
		
		// cache the map options
		var mo = options.map,
		
			// and then create mapOptions object
			mapOptions = {
				zoom: mo.zoom,
				mapTypeId: mo.mapTypeId,
				center: new google.maps.LatLng(mo.center[0], mo.center[1])
				},
				
				// a couple other variables we need
				lat, lng, title, content, 
				
				// cache the entry object (which holds all the spreadsheet data we need)
				entry = data.feed.entry;
		
		// create the map, giving it the DOM element to hold it and the mapOptions
		map = new google.maps.Map(document.getElementById(mo.elId),
			mapOptions);
		
		// create an infowindow to hold the content on each marker click
		infowindow = new google.maps.InfoWindow({
			content: ''
		});
		
		// loop through the entry object
		for (var key in entry) {
			if (entry.hasOwnProperty(key)) {
				// get the latitude
				lat = entry[key].gsx$latitude.$t;
				// get the longitude
				lng = entry[key].gsx$longitude.$t;
				// get the title (displayed on marker hover
				title = entry[key].gsx$title.$t;
				// get the description for the infowindow
				content = entry[key].gsx$description.$t;
				// and send all that to addMarker
				addMarker(lat, lng, title, content);
            }
		}	
	};
	
	// create a map marker
	function addMarker( lat, lng, title, content ) {
		var marker = new google.maps.Marker({
			position:new google.maps.LatLng(lat,lng),
			map: map,
			title: title
		});
		
		// add a listener for clicks on the marker
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent('<h2 class="marker-title">' + title + '</h2><p>' + linkify(content) + '</p>');
			infowindow.open(map,this);
		});			
	}

	return {
		
		// accepts config object to customize display
		// spreadsheet.key is required, everything else is optional
		init : function( config ) {
			
			var defaults = {
				map: {
					// this is about neighborhood level, higher would be more zoomed in
					// on regular roadmap tiles, highest zoom is 19
					zoom: 13,
					
					// lat, lng in an array
					// center defaults to star-telegram building
					center: ['32.751469', '-97.331443'],
					
					// the div element where the map will go
					elId: 'map-canvas',
					
					// options are ROADMAP, SATELLITE, HYBRID, TERRAIN
					mapTypeId: google.maps.MapTypeId.ROADMAP
					
				},
				
				// defaults for accessing google spreadsheet data
				spreadsheet: {
				
					// list or cell
					feedType: 'list',
					
					// the key from the spreadsheet URL, something like:
					// 0AqaF_i4pbfVndFRLWC1lRl9pRmMxTko4d1V2allENUE
					// empty string by default
					key: '',
					
					// 'od6' is typically id of default sheet, more here:
					// https://groups.google.com/a/googleproductforums.com/forum/#!category-topic/apps-script/getting-started/vb0uNm0XOJk
					worksheetId: 'od6',
					
					// can you figure out way to use this to get info, pass to addMarker function?
					// fields: ['gsx$latitude','gsx$longitude','gsx$address','gsx$description'],
					
					callback: 'newsMapper.setupMap'
					
				}
			};
			
			// extends the defaults with config object passed into init function
			options = extend( defaults, config );
			
			// kicks things off by getting spreadsheet data
			getSpreadsheet( options.spreadsheet );
			
		},
		// expose setupMap for the spreadsheet callback
		setupMap : setupMap
	};
}());