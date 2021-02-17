---
title: Color calibration and dual monitor setup in Windows 7
image: https://cdn.dvuckovic.com/posts/calibration-01_header.jpg
summary: Getting around a buggy system implementation
date: 2011-11-28
tags:
  - post
  - windows
  - script
  - dtp
  - color
readingTime: 15 minutes
---

Given the nature of my professional calling, I depend on properly calibrated monitors, since you can only rely so much on your experience when there are choices to be made concerning the color. While the eyedropper tool is indeed a godsend, calibration is a must in an environment where photo manipulation is in the play, which is nowadays very common. Add two or more monitors in the mix, and suddenly things don’t work as they are supposed to.

## The setup

I have a dual monitor setup at home, with a primary 5:4 panel used mainly for work/browsing and a secondary 16:10 panel for media/home theater thingy. I calibrated both of them using a third party system, obtaining appropriate ICC profiles for each. Window 7 finally did some much needed overhauling in the color management department, sporting new Color Management control panel. Even handy quick-n-dirty calibration is available using simple wizard, which can give you somewhat accurate results.

I mainly use one display at a time, but I often switch from one to another. They are even on a different walls of the room, and not exactly intended for Cloned or Extended Desktop. As I calibrated both of them, I expected each of them to be using a different profile for calibration. But, here comes the problem.

## The problem

I noticed this bug in XP, Vista and, unfortunately, Windows 7. If you have a dual head video card, dual monitors and different calibration for each of them, Windows will let you define appropriate profiles, and even load them on the first use (e.g. first user log-on). But, if you happen to switch the display from one or another, for example to watch some movies on a second monitor, and then continue working on the first one, things go awry.

I had different results with different setups, but Windows don’t seem to load appropriate profile each time you switch displays. Sometimes the wrong profile remains active (in the LUT in the card), usually the first one remains active, resulting in wrong color calibration on active display. You may then want to go back to the original display, and sometimes things go alright (original profile remains active), but sometimes the calibration simply vanishes!

In XP I used third party calibration loader, executed each start-up. When switching display, I needed to run it again, and things sometimes would fix themselves, sometimes not. It was a frustrating experience :)

![Example of wrong calibration profile loaded](https://cdn.dvuckovic.com/posts/calibration-02.jpg#nozoom)

So I was disappointed to learn that Windows 7 suffered from the same flaw. I even reproduced the problem when waking up the computer from stand by mode. Since going back to the third party software for color management was out of the question, I decided to stick with built-in and was forced to reload calibration from the control panel each time I switched the monitors.

Somehow the option to reload calibration is missing from the otherwise-packed Windows 7 shell commands. The *only* way to force reloading is either going to the control panel, or a system restart.

## The fix

So I started looking for a fix. On many support forums poor video drivers are blamed, emphasizing the fact that driver providers had this problem for many years without a fix. But I don’t think that is the case: things obviously work, otherwise there wouldn’t be profile loading at all. It seems to me that the system color management is to blame, specifically the lack of proper triggers for profile loading.

Looking for an answer, I stumbled upon an interesting new service in Windows 7: Trigger Start! Actually, it’s not a new service, it’s just an added functionality in regular Task Scheduler. But here is the fun part: it’s event based! Basically you can define a task to run based on a certain system trigger (e.g. event). By diving in the Task Scheduler administration console you can deduce that most system tasks are set up this way. Awesome!

![Windows 7 Task Scheduler console](https://cdn.dvuckovic.com/posts/calibration-03.jpg#nozoom)

Reading through them I found the one responsible for reloading calibration profiles! It’s conspicuously named "Calibration Loader" :) By going in it’s properties you can see it’s activated only on certain triggers, both of them dealing with the basically same thing: user log-on!

![Calibration Loader Properties](https://cdn.dvuckovic.com/posts/calibration-04.jpg#nozoom)

So only if we can add another trigger suitable for our case: switching displays. Enter a handy command line utility.

### DisplaySwitch

_UPDATE: Originally, I didn’t test Extended Desktop option, since I’m not using it often. But it’s good one to have, so I added a switch for this too, take a look below._

`DisplaySwitch` is a small utility which is responsible for bringing up the display switching dialog in Windows 7, using the _Win+P_ shortcut. But it also has command line mode via arguments, in order to switch displays programmatically. It’s working surprisingly well, but with a caveat. It does not raise a trigger necessary for Task Scheduler job.

But we can use another utility to do this at the same time when calling DisplaySwitch. Below is a simple script in Visual Basic Scripting language, which can be natively executed on Windows. Simply paste it in a text file with .VBS extension and you are set:

```vb
Set WshShell = WScript.CreateObject("WScript.Shell")
WshShell.Run "C:\Windows\System32\DisplaySwitch.exe /external", 0, TRUE
WshShell.Run "eventcreate /l System /t INFORMATION /so DisplaySwitch /id 200 /d ""Switching display...""", 0, TRUE
```

This is fairly simple, but let’s take a look at it. Second command executes `DisplaySwitch` utility with an `/external` argument in order to activate the external display. Third line uses `eventcreate` command to log a System event for the previous action. Easy, right?

You can reverse the `DisplaySwitch` command and here is the .VBS script for making the primary monitor active:

```vb
Set WshShell = WScript.CreateObject("WScript.Shell")
WshShell.Run "C:\Windows\System32\DisplaySwitch.exe /internal", 0, TRUE
WshShell.Run "eventcreate /l System /t INFORMATION /so DisplaySwitch /id 200 /d ""Switching display...""", 0, TRUE
```

And for Extended Desktop version, a separate switch:

```vb
Set WshShell = WScript.CreateObject("WScript.Shell")
WshShell.Run "C:\Windows\System32\DisplaySwitch.exe /extend", 0, TRUE
WshShell.Run "eventcreate /l System /t INFORMATION /so DisplaySwitch /id 200 /d ""Switching display...""", 0, TRUE
```

### New trigger

Now we can go back to the Calibration Loader Properties dialog and define new trigger for it. Click New... and add a basic trigger like on a screenshot below.

![Adding a new trigger](https://cdn.dvuckovic.com/posts/calibration-05.jpg#nozoom)

New trigger starts the task "On an event" logged under "System" with a source set to "DisplaySwitch" and with an ID of "200" (all OK).

Now you can define shortcuts for each of the .VBS script and conveniently place them on a toolbar of choice. Clicking appropriate shortcut will switch your display, raise the event, and Calibration Loader will do the rest. Voilà!

![Trigger shortcut](https://cdn.dvuckovic.com/posts/calibration-06.jpg#nozoom)

This is a very simple fix, using only built in tools, and I wonder why things like this haven’t been fixed already? Considering that a dual monitor setup is common among professionals (which should be calibrated), it’s very likely this problem is widespread.
