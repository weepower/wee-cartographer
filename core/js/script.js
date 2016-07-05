/* global L */

Wee.fn.make('Cartographer', {
	/**
	 * Creates the map using the ID you've provided, and sets image paths and
	 * attribution settings that we commonly use.
	 *
	 * TODO: Put the config into a single object
	 * TODO: Add scrollToMarker functionality
	 *
	 * @param {object} setup
	 * @return void
	 */
	init: function(params) {
		var conf = $.extend({
			startPoint: [36.16, -86.78],
			startZoom: 13,
			ref: 'map',
			mapbox: false,
			attribution: Wee.view.render('cartographer.attribution')
		}, params),
			url;

		this.conf = conf;

		if (! conf.mapbox) {
			url = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
		} else {
			url = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';
		}

		this.map = L.map($('ref:' + conf.ref)[0]).setView(conf.startPoint, conf.startZoom);

		this.map.attributionControl.setPrefix(false);

		L.Icon.Default.imagePath = '/assets/modules/cartographer/img/';

		L.tileLayer(url, {
			attribution: conf.attribution,
			id: conf.mapbox.projectId,
			accessToken: conf.mapbox.accessToken
		}).addTo(this.map);

		// TODO: Store these values in a general sense, rather than specifically
		this.markers = {};
		this.circles = {};
		this.polygons = {};
	},

	/**
	 * Adds a marker to the map.
	 *
	 * @param {array} marker The lat/long location of the marker, and any options
	 * @return void
	 */
	addMarker: function(params) {
		var marker = L.marker([params.lat, params.long], params.options);

		if (params.popup) {
			marker.bindPopup(params.popup.content, params.popup.options);
		}

		marker.addTo(this.map);

		this.markers[params.id] = marker;

		return this.markers[marker.id];
	},

	/**
	 * Removes a marker from the map.
	 *
	 * TODO: Combine these into one method to remove any feature from map
	 * TODO: Handle boolean returns properly instead of always true
	 *
	 * @param {string} identifier The marker's identifier passed during creation
	 * @return void
	 */
	removeMarker: function(identifier) {
		this.map.removeLayer(this.markers[identifier]);

		this.markers[identifier] = null;

		return true;
	},

	/**
	 * Add a circle to the map.
	 *
	 * @param {object} params Settings to define a circle
	 * @return void
	 */
	addCircle: function(params) {
		var circle = L.circle(params.centerPoint, params.radius);

		circle.addTo(this.map);

		this.circles[params.id] = circle;
	},

	/**
	 * Remove a circle from the map.
	 *
	 * @param {string} identifier The circle's identifier
	 * @return boolean
	 */
	removeCircle: function(identifier) {
		this.map.removeLayer(this.circles[identifier]);

		this.circles[identifier] = null;

		return true;
	},

	/**
	 * Add a polygon to the map.
	 *
	 * @param {object} params Points and options for a polygon
	 * @return void
	 */
	addPolygon: function(params) {
		var polygon = L.polygon(params.points);

		this.polygons[params.id] = polygon;

		polygon.addTo(this.map);
	},

	/**
	 * Remove a polygon from the map.
	 *
	 * @param {string} identifier The polygon's identifier
	 * @return boolean
	 */
	removePolygon: function(identifier) {
		this.map.removeLayer(this.polygons[identifier]);

		this.polygons[identifier] = null;

		return true;
	},

	/**
	 * Check whether a given circle or polygon contains a given marker.
	 *
	 * @param {string} container The container's identifier
	 * @param {string} identifier The marker's identifier
	 * @return boolean
	 */
	contains: function(container, identifier) {
		return this.circles[container]
			.getBounds()
			.contains(this.markers[identifier]
			.getLatLng());
	},

	/**
	 * Move the map view to a given set of coordinates
	 *
	 * TODO: Add support for options
	 *
	 * @param {array} coords the lat/long coordinates
	 * @param {int} zoom Map zoom level
	 * @return void
	 */
	panTo: function(coords, zoom) {
		this.map.setView(coords, zoom ? zoom : this.conf.startZoom, {
			animation: true
		});
	}
});