/**
 * Eros Anwar Online PropRead v1.0.0
 * Copyright 2014 Eros Anwar Online
 * http://erosanwar.tripod.com/
 *
 * License: MIT
 * Date: 2014-06-25 16:41
 */
(function (window) {
	"use strict";
	/*global window */
	/*global document */
	/*jslint plusplus: true */
	
	// The APIs.
	// Extend existing EAO if available.
    var EAO = window.EAO || {};
	
	EAO = {
		loadPropFile: function (url, force) {
			var isLoaded = (EAO.getProp(url) === "true"),
				xhr = new XMLHttpRequest();
			
			if (isLoaded && !force) {
				return;
			}
			
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					var lines = xhr.responseText.split("\n");
					
					lines.forEach(function (element, index, array) {
						var keyValue = element.split("=");
						
						localStorage.setItem(keyValue[0], keyValue[1]);
					});
					
					localStorage.setItem(url, "true");
				}
			};
			xhr.open("GET", url, true);
			xhr.send();
		},
		getProp: function (name) {
			return localStorage.getItem(name);
		}
	};

	// Expose to global namespace.
	window.EAO = EAO;
})(window);
