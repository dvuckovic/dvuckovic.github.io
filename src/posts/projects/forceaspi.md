---
title: forceASPI Installer
image: https://cdn.dvuckovic.com/projects/aspi.gif
summary: Small installer that backs up your current ASPI layer and installs older Adaptec ASPI32 4.60 (1021)
date: 2004-08-28
tags:
  - project
  - windows
  - utility
readingTime: 15 Minutes
---

![forceASPI](https://cdn.dvuckovic.com/projects/aspi.png#icon#nozoom)

forceASPI is a suite of scripts designed to install proven to work Adaptec ASPI layer on your Intel x86 (or compatible) 32bit Windows operating system. Originally they were written by Wimpy from flexion.org, but were distributed in MS-DOS batch format and hence complicated to use. I rewritten them as a simple NSIS installer and tested them on various systems.

## Download

* [forceASPI.exe](https://cdn.dvuckovic.com/downloads/forceASPI.exe)
* [aspichk.exe](https://cdn.dvuckovic.com/downloads/aspichk.exe)

## Background

forceASPI ignores the system requirements which are imposed by Adaptec’s own installer and allows you to install Adaptec ASPI 4.60 (1021) on your PC regardless of your hardware or software configuration.

The scripts which make up forceASPI will automatically detect your operating system and install the appropriate files correctly. The following operating systems have been tested:

* Windows 98 Second Edition
* Windows ME
* Windows NT 4.0
* Windows 2000
* Windows XP (SP1, SP2)

## Why use forceASPI?

These are the main reasons why forceASPI was created and why you might want to use it:

* No ASPI Layer in Windows 2000 and XP
* Windows 9x and Windows ME ASPI Layer sucks :)
* Many CD Digital Audio rippers require a working ASPI layer
* Many DVD Rippers require a working ASPI layer
* Most CD-R writing applications require a working ASPI layer

## aspichk

aspichk is a tool provided by Adaptec to report what version of the ASPI Layer you have installed and checks if everything is working OK. To test your ASPI Layer with aspichk, just download it and then run it.

## Source code

Complete [source code](https://github.com/dvuckovic/forceASPI) for installer was written in NSIS. Original set of Wimpy’s MS-DOS batch scripts is also included.
