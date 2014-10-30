# EAO Util

EAO Util is basically a set of functions previously used in my website, Eros Anwar Online. The functions are collected from custom scripts I used in version 1 and 2 of my website. Some of the codes were copied somewhere from the Internet. They are rewritten to ease code reuse.

## Functions

EAO.cookie(name, value[, expiryHour])  
EAO.cookie(name)  
EAO.removeCookie(name)  
EAO.sessionProp(sessionOnly)  
EAO.prop(key, value)  
EAO.prop(key)  
EAO.removeProp(key)  
EAO.simpleHttpRequest(url, success[, mimeType])  
EAO.loadPropFile(url[, force])  
EAO.Date.daysInMonth(year, month)  
EAO.Date.julianDay(year, month, day)  
EAO.Date.dayOfWeek(year, month, day)  
EAO.Date.age(year, month, day)  
EAO.Date(year, month, day)

```javascript
var date = EAO.Date(2014, 10, 30); // Returns an object with functions below.
date.daysInMonth();
date.julianDay();
date.dayOfWeek();
date.age();
date.hijriDate();
```
## Deprecated

I plan to remove these in version 2.6.0  
  
EAO.setCookie(name, value[, expiryHour[, path]])  
EAO.getCookie(name)  
EAO.deleteCookie(name[, path])  
EAO.getDaysInMonth(year, month)  
EAO.getJulianDay(year, month, day)  
EAO.getDayOfWeek(year, month, day)  
EAO.getAge(year, month, day)  
EAO.getHijriDate(year, month, day)  
EAO.simpleHttpRequest(url, success)  
EAO.loadPropFile(url, force)  
EAO.setProp(key, value)  
EAO.getProp(name)

## UI

EAO.ui.Calendar(year, month, targetElement)

```javascript
var
  calendar = EAO.ui.Calendar(2014, 9, document.getElementById("div1")),
  day = calendar.day(8);

day.story("Version 2.2.0 released", "https://github.com/erosanwar/eao"); // Set story. 
day.listen("click", function (event) { alert("Hello 2.2.0!"); }); // Add event. 

// or,

  day
    .story("Version 2.2.0 released", "https://github.com/erosanwar/eao") // Set story.
    .listen("click", function (event) { alert("Hello 2.2.0!"); }); // And add event.

alert(day.story()); // Get story.
```

## License

EAO Util is distributed under the MIT License.
