---
title: shutAMP
image: https://cdn.dvuckovic.com/projects/winamp.gif
summary: General purpose plugin for Winamp 2.x which does full system (Windows) shutdown when Winamp reaches the end of playlist
date: 2002-09-20
tags:
  - project
  - winamp
  - plugin
readingTime: 15 Minutes
---

![shutAMP](https://cdn.dvuckovic.com/projects/shutamp.png#icon#nozoom)

shutAMP is yet-another general purpose plugin for Winamp 2.x which does full system (Windows) shutdown when Winamp reaches the end of playlist during the normal play. Shutdown doesn’t commence immediately and shutAMP displays a countdown dialog with a Cancel button prior the shutdown.

Why do we need another shutdown agent for Winamp, you will ask? Because this one will really work. Shutdown sequence is based on a Microsoft documented issue on ExitWindowsEx function and has been tested on Win9x as well on Win2000 platforms. It will guaranteed shutdown your system and turn the power off (if you own an ATX tower!).

## Download

* [shutAMP.exe](https://cdn.dvuckovic.com/downloads/shutAMP.exe)

## Requirements

* Winamp 2.x
* Microsoft® Visual Basic® 6.0 Run-Time files

## Usage

Enabling shutAMP is done via Winamp Preferences window, in General Purpose section. The quickest way to accomplish this is to press **Ctrl+P** somewhere in Winamp, and the Preferences window will be shown. Select shutAMP entry in right list box, and click Configure. In shutAMP configuration dialog you can enable it by turning on the "Enable" button. Before you can do this, you must unlock the button, by checking "Arm" checkbox. When you check it, "Enable" button will become active, and you may click it. Current status of shutAMP will be displayed as a caption on the "Enable" button (Enabled/Disabled). By pressing the "Hide" button configuration dialog will hide, maintaining options which were set.

When shutAMP is enabled, it will constantly monitor current state of Winamp, and when Winamp stops on last song in the current playlist, it will commence shutdown proccess. You will still have 3 seconds to change you mind, by clicking the "Cancel" button in the countdown dialog.

## Uninstallation

You must manually delete following files from your `Winamp\Plugins` directory:

```
gen_shutAMP.v21.dll
shutAMP.dll
shutAMP.txt
```

## Featured plugin

shutAMP was a "Featured Plugin" at Winamp.com on November 14th 2002, and had 44k+ downloads over the years.

## Deprecated

This plugin is now deprecated, since Winamp 5 brought it’s shutdown option. Right click the stop button in Winamp’s main window, and choose "On end of queue>Shutdown."

## Source code

Complete [source code](https://github.com/dvuckovic/shutAMP) for this plugin was written in Visual Basic 6, setup in Nullsoft PiMP, and code uses [GenWrapper](http://www.mr-colin.com/projects/winamp/genwrapper/) library, which allows Winamp 2 general purpose plugins to be written in Visual Basic.
