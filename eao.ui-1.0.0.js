/**
 * Eros Anwar Online UI Extension v1.0.0
 * Copyright 2004, 2014 Eros Anwar Online
 * http://erosanwar.tripod.com/eaoutil/
 *
 * License: MIT
 * Date: 2014-10-07 17:32
 */
(function (EAO) {
	"use strict";
	/*jslint plusplus: true */
	
	if (!EAO) {
		throw new Error("EAOUtilError", "Eros Anwar Utilities is not found!");
	}
	
	// Classes (prototypes).
	var Day = {
			// The <td> element.
			data: null,
		
			/**
			 * Set event listener to the <td> element.
			 * @param {String} type Event type.
			 * @param {Object} listener Listener function with
			 *                          event parameter.
			 * @param {Boolean} useCapture Value that specifies whether the
			 *                             event should be executed in the
			 *                             capturing or in the bubbling phase.
			 * @returns {Object} Return the Day object.
			 */
			listen: function (type, listener, useCapture) {
				var td = this.data;
				td.addEventListener.apply(td, arguments);
				return this;
			},

			/**
			 * story() Get the description of the day
			 * @returns {String} Return the description of the day.
			 * or
			 * story(description, link) set the description of the day
			 * with optional link.
			 * @param {String} description Description of the day.
			 * @param {String} link Optional URL to the description.
			 */
			story: function (description, link) {
				var td = this.data,
					text = td.textContent,
					a = null;

				if (arguments.length === 0) {
					return td.getAttribute("data-description");
				} else {
					while (td.hasChildNodes()) {
						td.removeChild(td.firstChild);
					}

					td.textContent = text;

					if ((typeof link !== "undefined") && (link !== null) && (link.length > 0)) {
						a = document.createElement("a");
						a.setAttribute("href", link);
						a.textContent = td.textContent;

						td.textContent = "";
						td.appendChild(a);
					}

					td.setAttribute("data-description", description);
					return this;
				}
			}
		},
		Calendar = {
			// The HTML table containing the days in the calendar.
			data: null,

			/**
			 * Get the day from the calendar.
			 * @param {Number} day The calendar day.
			 * @returns {Object} Return a Day object.
			 */
			day: function (day) {
				var o = Object.create(Day);
				o.data = this.data.getElementsByClassName("d-" + day)[0];
				return o;
			}
		};
	
	// Setup ui namespace.
	EAO.ui = {};
	
	// Override this to use different day names, e.g. Sun, Mon, Tue...
	EAO.dayNames = ["S", "M", "T", "W", "T", "F", "S"];

	/**
	 * Create a calendar to the target.
	 * @param {Number} year The calendar year.
	 * @param {Number} month The calendar month.
	 * @param {Element} targetElement The DOM element to put the calendar e.g. a <div>.
	 * @returns {Object} Return the calendar object.
	 */
	EAO.ui.Calendar = function (year, month, targetElement) {
		var daysInMonth = EAO.getDaysInMonth(year, month),
			monthStartDayOfWeek = EAO.getDayOfWeek(year, month, 1),
			tableHtml = null,
			numOfBoxes = daysInMonth + monthStartDayOfWeek,
			row,
			th,
			td,
			i = 0,
			count = 0,
			instance = Object.create(Calendar);
			
		if (targetElement.getElementsByClassName("eao-calendar").length === 1) {
			instance.data = targetElement.getElementsByClassName("eao-calendar")[0];
			return instance;
		}

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
				td.className = "d-" + td.textContent;
			}

			// Append the cell to the row.
			row.appendChild(td);
		}

		tableHtml.appendChild(row);
		targetElement.appendChild(tableHtml);
		
		instance.data = tableHtml;

		return instance;
	};
}(window.EAO));
