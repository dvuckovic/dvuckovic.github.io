---
title: screenHold
image: https://cdn.dvuckovic.com/projects/screensaver.jpg
summary: Tray app that lets you temporarily disable screensaver activation in Windows with a single click
date: 2003-01-10
tags:
  - project
  - windows
  - utility
readingTime: 10 Minutes
---

![screenHold](https://cdn.dvuckovic.com/projects/screenhold.png#icon#nozoom)

screenHold is tray app that lets you temporarily disable screensaver activation in Windows with a single click.

## Download

* [screenHold.exe](https://cdn.dvuckovic.com/downloads/screenHold.exe)

## Requirements

* Microsoft® Visual Basic® 6.0 Run-Time files

## Info

You probably noticed, during your work in Windows, that some programs simply do not disable screensaver during their operation and screensaver’s popping can seriously harm their process or, much worse, block your system. screenHold is small utility that resides in your system tray and lets you toggle Windows screensaver status with a single click. It also has an indicating icon that tells you the current status of screensaver. It’s a small grey monitor icon which changes the screen color:

* black w/green (this means your Screensaver is active)
* blue (this means your Screensaver is inactive)
* red (this means your Screensaver has been permanently disabled from Display properties)

## Known bugs

A little bit longer refresh rate (1000ms) when changing screensaver status from Display properties (prolonged for smaller CPU resource).

## Source code

Complete [source code](https://github.com/dvuckovic/screenHold) was written in Visual Basic 6, setup in NSIS.
