---
title: mobiweather.net
image: https://cdn.dvuckovic.com/projects/mobiweather-net.jpg
summary: Mobile weather site with conditions & forecast for Serbia
date: 2013-01-20
tags:
  - project
  - web
  - mobile
readingTime: 15 Minutes
---

_UPDATE: Sadly, this project has been unpublished due to low usage_ :(

It’s been a long time I’ve wanted to create a mobile site, using one of the many currently popular mobile frameworks, but I just couldn’t find the time. Recently I had some spare time, so I figured it will be good opportunity to glance at the framework options one has nowadays. I was mostly impressed, it’s an area heavy with advancements, but one framework got mine attention since it’s based on jQuery.

## jQuery Mobile

Premise is simple: you include jQuery and [jQuery Mobile](http://jquerymobile.com/) framework in your code, define pages and elements on them and let it do the rest. Extensive documentation is riddled with examples and real-life examples, so I haven’t got any problem whatsoever. Also, they include a nifty Themeroller engine which enables you to create custom theme in just a few drag & drops, assuming you want to remain in default layout. But customizing it it’s pretty easy, since everything can be done through CSS overrides, it’s just a matter of finding right class.

The thing I wanted to learn most was responsive design, e.g. how to position elements on the page depending on the various screen sizes of devices out there. jQuery Mobile implements `@media` CSS directives which makes it ultra easy. If you are using [built-in layout grids](http://jquerymobile.com/demos/1.2.0/docs/content/content-grids.html) for content formatting (`ui-grid`), you can be up and running in no time. Just define widths of screen which are your border line cases, and it should work.

## Proof of concept

So, I set out to make a sample site, one of the first ideas that popped in my head was a mobile weather site. [National weather service](http://www.hidmet.gov.rs/) of my country has very limited site, which is literally unreadable on small screens, and has some other problems (inability to click links, etc). First I thought maybe an Android app was a better option, but finally I went for the mobile site.

### Data

First, I needed some data, so a fetching script was in order. PHP is very effective in this because of robust regular expressions support, so I made a couple of scripts for different data which scans the site, and outputs JSON feeds. Also I’m fetching some images with interesting data on regular intervals (namely radar and satellite images).

Data was then put to use with an AJAX call from the mobile page. It’s used to populate elements on the page (icons, numbers, etc). This approach makes for much speedier experience on slow connections, since only new JSON call is initiated without a full page refresh.

I do not have explicit permission for this data, this project is strictly unofficial, but I figure since it’s work of public service company I should be safe (also everybody is doing it!). I know that there are some foreign sites with appropriate APIs and all, but quality of their data is not a match for national ones.

### UX

jQuery has some interesting events, swipe is my favorite. I used it to switch between 3- and 5-day forecast. Site also intelligently records user preferences, so everything should be as you left it when you revisit :)

### Geo-location

This is pretty straightforward, and works out-of-the-box in all modern browsers (using navigator.geolocation object). When the script gets user location, it calculates distance to all the cities and towns in the list, and switches automatically to nearest one.

### Sunrise/sunset times

I thought it would be great if icons for nighttime conditions would be different from those in the daytime. After all, icon set had these icons with moon instead of sun for clear weather. I found excellent implementation of [solar positioning](http://kybernetikos.github.com/SolarPosition/) for Javascript, and the script passes current city latitude and longitude in order to get super precise sunrise and sunset times :)

## Result

The result was live for more than 5 years on the _mobiweather.net_ domain. As I said, it was strictly unofficial and non-profit, and in the end it wasn’t that popular (only myself and couple of friends were using it). Initially, it was hosted on a shared hosting server and was a little bit on the slow side, but eventually it was moved to the AWS platform, so it became much snappier :)

<small>_All data courtesy of [RHMZ](http://www.hidmet.gov.rs/)_</small><br/>
<small>_Weather icons by [MerlinTheRed](https://merlinthered.deviantart.com/art/plain-weather-icons-157162192)_</small>
