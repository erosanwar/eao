/**
 * Eros Anwar Online Utilities v2.1.0
 * Copyright 2004, 2014 Eros Anwar Online
 * http://erosanwar.tripod.com/
 *
 * Except
 * Portions http://www.oriold.uzh.ch/static/hegira.html
 * Portions http://www.s77.com/java2/page-details/page-up-for.html
 * Portions http://stackoverflow.com/questions/4881938/javascript-calculate-number-of-days-in-month-for-a-given-year?answertab=votes#tab-top
 *
 * License: MIT
 * Date: 2014-06-30 11:44
 */
(function (global) {
	"use strict";
	/*jslint plusplus: true */

	var eaoversion = "2.1.0",

		// Get the integer part of a float.
		intPart = function (floatNum) {
			if (floatNum < -0.0000001) {
				return Math.ceil(floatNum - 0.0000001);
			} else {
				return Math.floor(floatNum + 0.0000001);
			}
		},

		// The APIs.
		EAO = {
			// The current version of Eros Anwar Online Utilities.
			version: eaoversion,
			
			// Override this to use different day names, e.g. Sun, Mon, Tue...
			dayNames: ["S", "M", "T", "W", "T", "F", "S"],

			// Classes.
			/**
			 * Create a calendar to the target.
			 * @param {Number} year The calendar year.
			 * @param {Number} month The calendar month.
			 * @param {Element} targetElement The DOM element to put the calendar e.g. a <div>.
			 */
			Calendar: function (year, month, targetElement) {
				var daysInMonth = EAO.getDaysInMonth(year, month),
					monthStartDayOfWeek = EAO.getDayOfWeek(year, month, 1),
					tableHtml = null,
					numOfBoxes = daysInMonth + monthStartDayOfWeek,
					row,
					th,
					td,
					i = 0,
					count = 0;

				if (numOfBoxes % 7 !== 0) {
					numOfBoxes = numOfBoxes + (7 - (numOfBoxes % 7));
				}

				// Create the table.
				tableHtml = document.createElement("table");
				tableHtml.className = "eao-calendar";

				// Create the header row.
				row = document.createElement("tr");

				// Populate day names.
				for (i = 0, count = EAO.dayNames.length; i < count; i++) {
					th = document.createElement("th");
					th.textContent = EAO.dayNames[i];
					row.appendChild(th);
				}

				// Append the row to the table.
				tableHtml.appendChild(row);

				for (i = 0; i < numOfBoxes; i++) {
					if (i % 7 === 0) {
						row = document.createElement("tr");
					} else if (i % 7 === 6) {
						tableHtml.appendChild(row);
					}

					// Create the cell.
					td = document.createElement("td");

					if ((i < monthStartDayOfWeek) || (i > (daysInMonth + monthStartDayOfWeek - 1))) {
						td.textContent = "";
					} else {
						td.textContent = i + 1 - monthStartDayOfWeek;
					}

					// Append the cell to the row.
					row.appendChild(td);
				}

				tableHtml.appendChild(row);

				if (tableHtml) {
					targetElement.appendChild(tableHtml);
				}
			},

			// Functions.
			/**
			 * Set a cookie value.
			 * @param {String} name The name of the cookie.
			 * @param {String} value The value of the cookie.
			 * @param {Number} expiryHour An integer to expire the cookie.
			 * @param {String} path A URL path from the base URL, e.g. /eao. 
			 */
			setCookie: function (name, value, expiryHour, path) {
				var expireDate = new Date(),
					cookieStr = "";

				expireDate.setHours(expireDate.getHours() + expiryHour); // cookie will expire within expiryHour	
				cookieStr = name + "=" + value + ";expires=" + expireDate.toGMTString();

				if (path) {
					cookieStr += ";path=" + path;
				}

				document.cookie = cookieStr;
			},

			/**
			 * Get a cookie value.
			 * @param {String} name The name of the cookie.
			 * @returns {String} Return the value of the cookie based on the name, empty string ("") if not found.
			 */
			getCookie: function (name) {
				var cookies = [],
					value = "", // default, cookie does not exist
					i = 0,
					count = 0;

				if (document.cookie) { // if document has cookie
					cookies = document.cookie.split(";");
					for (i = 0, count = cookies.length; i < count; i++) {
						if (cookies[i].split("=")[0].trim() === name) {
							value = cookies[i].split("=")[1].trim();
							break;
						}
					}
				}

				return value;
			},

			/**
			 * Delete a cookie. Basically, expire the cookie immediately.
			 * @param {String} name The name of the cookie.
			 * @param {String} path A URL path from the base URL, e.g. /eao. 
			 */
			deleteCookie: function (name, path) {
				EAO.setCookie(name, "", -1, path);
			},

			/**
			 * Get the number of days in a month.
			 * @param {Number} year An integer of the calendar year.
			 * @param {Number} month An integer of the calendar month.
			 * @returns {Number} Return an integer of the number of days.
			 */
			getDaysInMonth: function (year, month) {
				var monthStart = new Date(year, month - 1, 1),
					monthEnd = new Date(year, (month - 1) + 1, 1),
					monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);

				return monthLength;
			},

			/**
			 * Get the Julian day number.
			 * @param {Number} year An integer of the calendar year.
			 * @param {Number} month An integer of the calendar month. 
			 * @param {Number} day An integer of the calendar month.
			 * @returns {Number} Return an integer of the Julian day.
			 */
			getJulianDay: function (year, month, day) {
				var nJD;

				if ((year > 1582) || ((year === 1582) && (month > 10)) || ((year === 1582) && (month === 10) && (day > 14))) {
					nJD = intPart((1461 * (year + 4800 + intPart((month - 14) / 12))) / 4) +
						intPart((367 * (month - 2 - 12 * (intPart((month - 14) / 12)))) / 12) -
						intPart((3 * (intPart((year + 4900 + intPart((month - 14) / 12)) / 100))) / 4) + day - 32075;
				} else {
					nJD = 367 * year - intPart((7 * (year + 5001 + intPart((month - 9) / 7))) / 4) + intPart((275 * month) / 9) + day + 1729777;
				}

				return nJD;
			},

			/**
			 * Get the day of week number.
			 * @param {Number} year An integer of the calendar year.
			 * @param {Number} month An integer of the calendar month. 
			 * @param {Number} day An integer of the calendar month.
			 * @returns {Number} Return an integer of the day of week.
			 */
			getDayOfWeek: function (year, month, day) {
				var date = new Date(year, month - 1, day);

				return date.getDay();	// 0 == Sunday
			},

			/**
			 * Get the age.
			 * @param {Number} year An integer of the calendar year.
			 * @param {Number} month An integer of the calendar month. 
			 * @param {Number} day An integer of the calendar month.
			 * @returns {Object} Return an object with year, month and day.
			 */
			getAge: function (year, month, day) {
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
			},

			/**
			 * Get the Hijri date.
			 * @param {Number} year An integer of the calendar year.
			 * @param {Number} month An integer of the calendar month. 
			 * @param {Number} day An integer of the calendar month.
			 * @returns {Object} Return an object with year, month and day.
			 */
			getHijriDate: function (year, month, day) {
				var nHYear, nHMonth, nHDay,
					l = EAO.getJulianDay(year, month, day) - 1948440 + 10632,
					n = intPart((l - 1) / 10631),
					m = l - 10631 * n + 354,
					j = intPart((10985 - m) / 5316) * intPart((50 * m) / 17719) + intPart(m / 5670) * intPart((43 * m) / 15238),
					k = m - intPart((30 - j) / 15) * intPart((17719 * j) / 50) - intPart(j / 16) * intPart((15238 * j) / 43) + 29;

				nHMonth = intPart((24 * k) / 709);
				nHDay = k - intPart((709 * nHMonth) / 24);
				nHYear = 30 * n + j - 30;

				return { year: nHYear, month: nHMonth, day: nHDay };
			},

			/**
			 * Load a properties file (e.g. *.properties) with AJAX into the local storage.
			 * This function assumes the properties in the file are multiple lines of
			 * key=value items.
			 * @param {String} url A URL to the properties file.
			 * @param {Boolean} force Optional. Force to load the properties.
			 */
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

			/**
			 * Get a property loaded with loadPropFile(url [, force]).
			 * @param {String} name The name (key) of the property.
			 * @returns {String} Return the value of the named property.
			 */
			getProp: function (name) {
				return localStorage.getItem(name);
			}
		};
    
	// Expose to global namespace.
	global.EAO = EAO;
}(window));
