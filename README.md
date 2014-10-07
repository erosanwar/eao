# EAO Util

EAO Util is basically a set of functions previously used in my website, Eros Anwar Online. The functions are collected from custom scripts I used in version 1 and 2 of my website. Some of the codes were copied somewhere from the Internet. They are rewritten to ease code reuse.

## Functions

EAO.setCookie(name, value, expiryHour, path)  
EAO.getCookie(name)  
EAO.deleteCookie(name, path)  
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
```javascript
var
  calendar = EAO.ui.Calendar(year, month, targetElement),
  day = calendar.day(n);

day.story(description, link); // Set story.
day.listen(type, listener[, useCapture]); // Add event.

// or,

  day
    .story(description, link) // Set story.
    .listen(type, listener[, useCapture]); // And add event.

day.story(); // Get story.
```


## License

EAO Util is distributed under the MIT License.

