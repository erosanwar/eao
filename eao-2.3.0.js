/**
 * Eros Anwar Online Utilities v2.3.0
 * Copyright 2004, 2014 Eros Anwar Online
 * http://erosanwar.tripod.com/eaoutil/
 *
 * License: MIT
 * Date: 2014-10-10 12:27
 */
(function (global) {
	"use strict";
	
	var
		// Internal use.
		version = "2.3.0",
		document = global.document,
		XMLHttpRequest = global.XMLHttpRequest,

		// Get the integer part of a float.
		intPart = function (floatNum) {
			return floatNum < -0.0000001 ?
				Math.ceil(floatNum - 0.0000001) :
				Math.floor(floatNum + 0.0000001);
		},

		// Helper methods.
		helpers = {
			cookie: {
				get: function (name) {
					var cookies = document.cookie.split(";"),
						i = 0,
						count = 0;

					for (i = 0, count = cookies.length; i < count; i++) {
						if (cookies[i].split("=")[0].trim() === name)
							return cookies[i].split("=")[1].trim();
					}

					return null;
				},
				set: function (name, value, expiryHour) {
					var cookieStr = name + "=" + value,
						expireDate;

					if (expiryHour) {
						expireDate = new Date();
						expireDate.setHours(expireDate.getHours() + expiryHour);
						cookieStr += ";expires=" + expireDate.toGMTString();
					}

					document.cookie = cookieStr;

					// Update the count of cookies.
					this.length = document.cookie.trim() === "" ?
						0 : document.cookie.split(";").length;
				},
				remove: function (name) {
					helpers.cookie.set.call(this, name, "", -1);
				}
			},
			storage: {
				choose: function (sessionOnly) {
					if (sessionOnly && global.sessionStorage) {
						return global.sessionStorage;
					}
					else if (global.localStorage) {
						return global.localStorage;
					}
					else {
						cookieStorage.useSession = sessionOnly;
						return cookieStorage;
					}
				}
			}
		},

		// An object to mimic sessionStorage and localStorage.
		cookieStorage = {
			useSession: false, // Is storage for this session only?
			length: 0,
			getItem: function (key) {
				return helpers.cookie.get.call(this, key);
			},
			setItem: function (key, value) {
				var args = Array.prototype.slice.call(arguments);

				if (!cookieStorage.useSession)
					args.push(5 * 365 * 24);

				helpers.cookie.set.apply(this, args);
			},
			removeItem: function (key) {
				helpers.cookie.remove.call(this, key);
			},
			clear: function () {
				var cookies = document.cookie.split(";"),
					i = 0, count = 0;

				for (i = 0, count = cookies.length; i < count; i++) {
					helpers.cookie.remove.call(this, cookies[i].split("=")[0].trim());
				}
			}
		},

		// Default storage.
		propStorage = helpers.storage.choose.call(this, true),

		// The APIs.
		EAO = {
			// The current version of Eros Anwar Online Utilities.
			eaoutil: version,

			// Copy of cookieStorage object.
			cookieStorage: cookieStorage,

			// Functions.
			/**
			 * Set a cookie value.
			 * @param {String} name The name of the cookie.
			 * @param {String} value value of the cookie.
			 * @param {Number} expiryHour integer to expire the cookie.
			 *
			 * Get a cookie value.
			 * @param {String} name The name of the cookie.
			 * @returns {String} Return the value of the cookie based on
			 *                   the name, empty string ("") if not found.
			 */
			cookie: function (name, value, expiryHour) {
				if (arguments.length === 1)
					return helpers.cookie.get.call(cookieStorage, name);
				helpers.cookie.set.apply(cookieStorage, arguments);
			},

			/**
			 * Delete a cookie. Basically, expire the cookie immediately.
			 * @param {String} name The name of the cookie.
			 */
			removeCookie: function (name) {
				helpers.cookie.remove.call(cookieStorage, name);
			},

			/**
			 * Set whether to use session-only. The function will decide the suitable storage.
			 * @param {Boolean} flag Session-only true or false.
			 */
			sessionProp: function (sessionOnly) {
				propStorage = helpers.storage.choose.call(this, sessionOnly);
			},

			/**
			 * Set a property to the local storage.
			 * @param {String} key The key (name) of the property.
			 * @param {String} value The value of the property.
			 *
			 * Get a property from the local storage.
			 * @param {String} key The key (name) of the property.
			 * @returns {String} Return the value of the named property.
			 */
			prop: function (key, value) {
				if (arguments.length === 1)
					return propStorage.getItem(key);
				propStorage.setItem(key, value);
			},

			/**
			 * Delete a property.
			 * @param {String} name The name of the property.
			 */
			removeProp: function (key) {
				propStorage.removeItem(key);
			},

			/**
			 * Load a remote URL for data.
			 * @param {String} url A URL to the properties file.
			 * @param {Function} success Callback function when the request is successful,
			 *                           function success (xhr, responseText).
			 */
			simpleHttpRequest: function (url, success, mimeType) {
				var xhr = new XMLHttpRequest();

				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4 && xhr.status === 200) {
						success.call(this, xhr);
					}
				};

				xhr.open("GET", url, true);

				if (xhr.overrideMimeType)
					xhr.overrideMimeType(mimeType || "text/xml");

				xhr.send();
			},

			/**
			 * Load a properties file (e.g. *.properties) with AJAX into storage.
			 * This function assumes the properties in the file are multiple lines of
			 * key=value items.
			 * @param {String} url A URL to the properties file.
			 * @param {Boolean} force Optional. Force to load the properties.
			 */
			loadPropFile: function (url, force) {
				var isLoaded = (EAO.prop(url) === "true");

				if (isLoaded && !force)
					return;

				EAO.simpleHttpRequest(
					url,
					function (xhr) {
						var responseText = xhr.responseText,
							lines = responseText.split("\n");

						lines.forEach(function (element) {
							var keyValue = element.split("=");
							EAO.prop(keyValue[0], keyValue[1]);
						});

						EAO.prop(url, "true");
					},
					"text/plain"
				);
			}
		};

	function EAODate (year, month, day) {
		return new EAODate.prototype.init(year, month, day);
	}

	// Static functions.
	/**
	 * Get the number of days in a month.
	 * http://www.electrictoolbox.com/javascript-days-in-month/
	 * @param {Number} year An integer of the calendar year.
	 * @param {Number} month An integer of the calendar month.
	 * @returns {Number} Return an integer of the number of days.
	 */
	EAODate.daysInMonth = function (year, month) {
		return new Date(year, month, 0).getDate();
	};

	/**
	 * Get the Julian day number.
	 * Modified from http://www.oriold.uzh.ch/static/hegira.html
	 * @param {Number} year An integer of the calendar year.
	 * @param {Number} month An integer of the calendar month.
	 * @param {Number} day An integer of the calendar month.
	 * @returns {Number} Return an integer of the Julian day.
	 */
	EAODate.julianDay = function (year, month, day) {
		if ((year > 1582) || ((year === 1582) && (month > 10)) || ((year === 1582) && (month === 10) && (day > 14))) {
			return intPart((1461 * (year + 4800 + intPart((month - 14) / 12))) / 4) +
				intPart((367 * (month - 2 - 12 * (intPart((month - 14) / 12)))) / 12) -
				intPart((3 * (intPart((year + 4900 + intPart((month - 14) / 12)) / 100))) / 4) + day - 32075;
		}

		return 367 * year - intPart((7 * (year + 5001 + intPart((month - 9) / 7))) / 4) + intPart((275 * month) / 9) + day + 1729777;
	};

	/**
	 * Get the day of week number.
	 * @param {Number} year An integer of the calendar year.
	 * @param {Number} month An integer of the calendar month.
	 * @param {Number} day An integer of the calendar month.
	 * @returns {Number} Return an integer of the day of week.
	 */
	EAODate.dayOfWeek = function (year, month, day) {
		return new Date(year, month - 1, day).getDay(); // 0 == Sunday
	};

	/**
	 * Get the age.
	 * Modified from http://www.s77.com/java2/page-details/page-up-for.html
	 * @param {Number} year An integer of the calendar year.
	 * @param {Number} month An integer of the calendar month.
	 * @param {Number} day An integer of the calendar month.
	 * @returns {Object} Return an object with year, month and day.
	 */
	EAODate.age = function (year, month, day) {
		var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			today = new Date(),
			currYear = today.getFullYear(),
			currMonth = today.getMonth(),
			currDay = today.getDate(),
			mStart = null,
			mEnd = null,
			days1 = 0,
			days2 = 0,
			dayst = 0,
			ydiff1 = 0,
			mdiff1 = 0,
			addOneMonth = 0;

		month = month - 1;
		mStart = new Date(year, (month === 12 ? 1 : month + 1), 1);
		days1 = (mStart - new Date(year, month, day)) / (24 * 60 * 60 * 1000) - 1;
		mEnd = new Date(currYear, currMonth, 1);
		days2 = (new Date(currYear, currMonth, currDay) - mEnd) / (24 * 60 * 60 * 1000) + 1;
		dayst = days1 + days2;

		if (dayst >= daysInMonth[month]) {
			addOneMonth = 1;
			dayst -= daysInMonth[month];
		} else {
			addOneMonth = 0;
		}

		ydiff1 = currYear - mStart.getFullYear();
		mdiff1 = currMonth - mStart.getMonth() + addOneMonth;

		if (mdiff1 > 11) {
			mdiff1 = 0;
			ydiff1++;
		}

		if (mdiff1 < 0) {
			mdiff1 = mdiff1 + 12;
			ydiff1--;
		}

		return { year: ydiff1, month: mdiff1, day: dayst };
	};

	/**
	 * Get the Hijri date.
	 * Modified from http://www.oriold.uzh.ch/static/hegira.html
	 * @param {Number} year An integer of the calendar year.
	 * @param {Number} month An integer of the calendar month.
	 * @param {Number} day An integer of the calendar month.
	 * @returns {Object} Return an object with year, month and day.
	 */
	EAODate.hijriDate = function (year, month, day) {
		var nHYear, nHMonth, nHDay,
			l = EAODate.julianDay(year, month, day) - 1948440 + 10632,
			n = intPart((l - 1) / 10631),
			m = l - 10631 * n + 354,
			j = intPart((10985 - m) / 5316) * intPart((50 * m) / 17719) + intPart(m / 5670) * intPart((43 * m) / 15238),
			k = m - intPart((30 - j) / 15) * intPart((17719 * j) / 50) - intPart(j / 16) * intPart((15238 * j) / 43) + 29;

		nHMonth = intPart((24 * k) / 709);
		nHDay = k - intPart((709 * nHMonth) / 24);
		nHYear = 30 * n + j - 30;

		return { year: nHYear, month: nHMonth, day: nHDay };
	};

	EAODate.prototype = {
		constructor: EAODate,
		init: function (year, month, day) {
			this.year = year;
			this.month = month;
			this.day = day;
		},
		daysInMonth: function () {
			return EAODate.daysInMonth(this.year, this.month);
		},
		julianDay: function () {
			return EAODate.julianDay(this.year, this.month, this.day);
		},
		dayOfWeek: function () {
			return EAODate.dayOfWeek(this.year, this.month, this.day);
		},
		age: function () {
			return EAODate.age(this.year, this.month, this.day);
		},
		hijriDate: function () {
			return EAODate.hijriDate(this.year, this.month, this.day);
		}
	};

	EAODate.prototype.init.prototype = EAODate.prototype;

	EAO.Date = EAODate;

	// Expose to global namespace.
	global.EAO = EAO;
}(window));

// Backward compatibility.
(function (EAO) {
	"use strict";

	EAO.deleteCookie = EAO.removeCookie;
	EAO.setCookie = EAO.cookie;
	EAO.getCookie = function (name) {
		return EAO.cookie(name) || "";
	};

	var _ED = EAO.Date;
	EAO.getDaysInMonth = _ED.daysInMonth;
	EAO.getJulianDay = _ED.julianDay;
	EAO.getDayOfWeek = _ED.dayOfWeek;
	EAO.getHijriDate = _ED.hijriDate;
	EAO.getAge = _ED.age;

	EAO.setProp = EAO.prop;
	EAO.getProp = EAO.prop;
}(window.EAO));
