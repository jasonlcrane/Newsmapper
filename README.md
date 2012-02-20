# README for Newsmapper

Newsmapper is a Javascript function used to display data from a Google Spreadsheet on a Google Map. 

# Usage
<pre>
newsMap.init({
    map: {
		center: ['32.7095961', '-97.3681394']
	},
	spreadsheet: {
		key: '0AqaF_i4pbfVndG8tU1RMYlE0U19SNnN0RmR2cGtSNVE'
	}
});
</pre>

# Requirements
  * The plugin has two required settings: map.center (a two element array with a latitude and longitude) and spreadsheet.key (the Google spreadsheet's key).

# Documentation
The plugin has several other options. Check them out in the full documentation at http://jasonlcrane.com/2012/02/creating-google-map-from-spreadsheet/.