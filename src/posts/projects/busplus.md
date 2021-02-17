---
title: BusPlus
image: https://cdn.dvuckovic.com/projects/busplus/map.jpg
summary: Small Android app for mass transit system in Belgrade that shows how far is the next bus from your station
date: 2012-03-07
sticky: true
weight: 4
tags:
  - project
  - android
  - java
paths:
  high: https://cdn.dvuckovic.com/projects/busplus/screenshots/
  low: https://cdn.dvuckovic.com/projects/busplus/screenshots/thumbs/
albums:
  - id: Screenshots
    photos:
    - name: screenshot-1.jpg
      title: Screenshots
      size: 375x600
    - name: screenshot-2.jpg
      title: Screenshots
      size: 375x600
    - name: screenshot-3.jpg
      title: Screenshots
      size: 375x600
    - name: screenshot-4.jpg
      title: Screenshots
      size: 375x600
    - name: screenshot-5.jpg
      title: Screenshots
      size: 375x600
    - name: screenshot-6.jpg
      title: Screenshots
      size: 375x600
  - id: Market
    photos:
    - name: market-1.jpg
      title: BusPlus on Android Market
      size: 360x600
    - name: market-2.jpg
      title: BusPlus on Android Market
      size: 360x600
readingTime: 15 Minutes
---

BusPlus is a small Android app for mass transit system in Belgrade that shows how far is the next bus from your station. As my first full app I used it to teach myself several things about development for Android OS. Coding for Android is relatively easy and I found all the necessary help by reading various Q&A at [Stack Overflow](http://stackoverflow.com/) and by using [this nice book](http://commonsware.com/AdvAndroid/) as a reference. Web is full of examples and tutorials on everything Android, and if you have some idea of what you need you will probably find it.

## BusPlus

At the start of 2012 mass transit in Belgrade moved to a new system for payment which added several perks. For example, every vehicle in the system is tracked by GPS and its position is sent to the central computer. To a user this location is available through simple USSD (MMI) service which queries the server and returns information. Of course these locations are coarse (probably for security reasons) and the system can show how many bus stops is a vehicle away from you (your current bus stop). Every bus stop has a unique code which is used as an input for the service. USSD service is available only on three local mobile networks. Service has begun with charging each query since September 16th 2012, and price varies across networks.

Since there are over 2000 stations in the city, in order to use the service conveniently I came up with an idea for an app. First, I compiled a list of all stations and their codes, along with their geo-coordinates (not an easy task!). Second, I looked into ways to query these USSD codes elegantly. Unfortunately, there is still no USSD API in the works (wtf Google?), but I managed to execute them by raising Intent to the system dialer app.

<div style="float: right; margin-left: 40px;">
    <iframe frameborder="0" height="430" width="240" class="float_right" src="https://www.youtube.com/embed/a_RA8AqtA94?rel=0"></iframe>
</div>

BusPlus app has three views and can be used to query the service in several ways:

* manual code entry (if you know it :)
* search by station name (not easy, because most of station names are duplicated for both directions)
* map of the city with your current location and nearby stations
* ability to plot stations on a different location on map
* list of favorites with manual entry and entry from database

App also supports two locales (Serbian and English), which can be switched in app Settings menu.

A few updates followed, in which I managed to squeeze in a several new features (mostly from comments):

* more complete station database
* more precise locations for most stations
* new line database (with stations in both directions)
* direct launcher shortcuts
* custom tab positions
* satellite map view
* renaming of favorites
* custom color launcher icons
* support for both Cupcake (1.5) and ICS/JB (4.x)
* option to move app to SD card (2.2+)
* home screen widget with balance
* charge warning before each query
* free web info service (deprecated)
* suburban stations & lines
* Tasker integration

<PhotoAlbum id="Screenshots" />

## Problems with database

I had problems finding complete database of bus stops in Belgrade, along with their codes and geo-coordinates. I had to merge several lists in order to get something to work, but it was outdated in many parts (some stations doesn’t exist anymore, some does). I was on a lookout for better data set, and, wouldn’t you know it, it popped up :) It was from official source, but unfortunately still incomplete. Physical locations of stations were a little bit off, so I set to correct them as much as I could.

To this goal, I developed an intranet script which utilized Google Maps API in order to plot the stops on a map from current database. I then used satellite map view in order to move station markers to the correct location. As soon as I moved it, location in database was updated with an AJAX call. It took some time, but I managed to get most of them in correct locations. Sadly, some 100 stations (out of 2500+) were left unassigned, since there isn’t information on their location yet. I will surely find a way around this, perhaps in a later update :)

## Download

App was downloadable via Google Play Store, as a free app. Unfortunately, due to inability to maintain it on my own, I decided to deprecate it. If you feel like building upon it, please see [below](#source-code) for a link to the source code.

<PhotoAlbum id="Market" />

## Donations

This project was open to optional donations, but isn’t anymore because of the lack of payment options.

## Source code

Complete [source code](https://github.com/dvuckovic/BusPlus) for this app was written in Java for Android using Eclipse IDE. Since this app use Google Maps MapView, you will need your own [API key](http://code.google.com/android/maps-api-signup.html) (change it in `map.xml` layout file). Source code is released under [WTFPL license](http://www.wtfpl.net/).
