---
title: slideCD
image: https://cdn.dvuckovic.com/projects/cds.jpg
summary: Versatile autorun compact disc system which displays HTML presentation in kiosk (fullscreen) mode
date: 2009-08-04
tags:
  - project
  - design
  - windows
paths:
  high: https://cdn.dvuckovic.com/projects/slidecd/
  low: https://cdn.dvuckovic.com/projects/slidecd/thumbs/
albums:
- id: SlideCDExamples
  photos:
    - name: slidecd-01.jpg
      title: slideCD content example
      size: 800x600
    - name: slidecd-02.jpg
      title: slideCD content example
      size: 800x600
    - name: slidecd-03.jpg
      title: slideCD content example
      size: 800x600
    - name: slidecd-04.jpg
      title: slideCD content example
      size: 800x600
    - name: slidecd-05.jpg
      title: slideCD content example
      size: 800x600
    - name: slidecd-06.jpg
      title: slideCD content example
      size: 800x600
    - name: slidecd-07.jpg
      title: slideCD content example
      size: 800x600
    - name: slidecd-08.jpg
      title: slideCD content example
      size: 800x600
    - name: slidecd-09.jpg
      title: slideCD content example
      size: 800x600
    - name: slidecd-10.jpg
      title: slideCD content example
      size: 800x600
    - name: slidecd-11.jpg
      title: slideCD content example
      size: 800x600
    - name: slidecd-12.jpg
      title: slideCD content example
      size: 800x600
    - name: slidecd-13.jpg
      title: slideCD content example
      size: 848x600
    - name: slidecd-14.jpg
      title: slideCD content example
      size: 848x600
    - name: slidecd-15.jpg
      title: slideCD content example
      size: 848x600
readingTime: 15 Minutes
---

![slideCD](https://cdn.dvuckovic.com/projects/slidecd.png#icon#nozoom)

slideCD is a versatile autorun compact disc system which displays HTML presentation in kiosk (fullscreen) mode. It’s primarily used for deploying standalone multimedia applications since HTML can render various types of content. Current variant is based on [Mozilla’s XUL platform](https://developer.mozilla.org/en-US/docs/Archive/Mozilla/XUL), runs in a copy of [XULRunner](https://developer.mozilla.org/en-US/docs/Archive/Mozilla/XULRunner) and supports both local and online content.

## Download

* [slideCD-v3.1.zip](https://cdn.dvuckovic.com/downloads/slideCD-v3.1.zip)

## Features

* Autorun _without_ system dependencies, runs on all _Windows NT_ platforms (NT/2000/XP/Vista/7)
* Runs from read-only medium (compact disc), uses local storage for temp files
* Supports both _local_ and _online_ content (on internet enabled clients)
* _Gecko 1.9.0.3_ renderer in current XULRunner’s browser
* Open structure, no need to compile it for different content
* Ability do easily incorporate Mozilla supported _plugins_
* Degrades gracefully, simple `index.html` shortcut to content on unsupported systems
* Cleans up after itself, leaves _bare minimum_ of temp files on system

## History

Originally I needed a standalone viewer for photo albums, and since I was coding mainly in Visual Basic, it was natural to turn to its capabilities. I made a test system using IE’s ActiveX control, wrapped in a kiosk window for fullscreen presentation. Content was done in HTML and included inside the program, which made it difficult to change it afterwards, since every change required recompiling of entire project.

It was also dependent on Visual Basic Runtime files, which were needed on a host system in order to execute autorun program (silly, I know). Anyway, this approach was momentarily abandoned in favor of a more versatile one.

I began experimenting with NSIS installers and noticed that NSIS has all necessary tools for the autorun program. At the same time, Mozilla Firefox project emerged as a candidate for content renderer. Several experiments were done trying to strip Firefox naked and run it in kiosk mode. It was bulky and slow however, so I remained open for options.
XULRunner

Enter XUL, XML User Interface Language, cross-platform markup, and it’s interpreter XULRunner. Since it is Mozilla’s application framework for all its applications (Firefox, Thunderbird, Prism), it was bound to behave much nicer and quicker. Initial tests were promising, so I sat down and wrote kiosk (fullscreen) browser app for it.

Next, I continued to experiment with different plugins, since Flash support was my goal in order to display some more interactive content. After several failed and complicated tests, I finally managed to incorporate Flash 10 support into it.

### Plugins

Flash was the primary option, since it was easy to implement and had the ability to display simple animations as well as embedded video, which does not rely on local codecs. MP4 support in Flash 9+ finally emerged as a holy grail, and made possible to stream high quality video inside the application.

However, Flash licensing system prohibits the distribution of unpackaged plugin, only as an installer. Since I wasn’t to happy about this option (to force users to install newest Flash plugin), I decided to leave this optional. So if you want to add the support for Flash inside the slideCD, try this:

* Install Flash Player as plugin at the system on which you are building your slideCD
* Search your system for following files (they are located somewhere inside the `%SystemRoot%\system32` folder these days):
    * `flashplayer.xpt`
    * `NPSWF32.dll`
* Copy both files to the `\slideCD\plugins` folder inside your slideCD
* That’s it! You’re ready.

This procedure should work with all compatible plugins. Just copy its NP* files to the `\slideCD\plugins` folder. I tested both PDF viewer and Quicktime plugins, but these are a little more complicated: they require several files copied on the system in specific places in order to work (if the user doesn’t have installed apps in the first place).

### Temp files

I tried to keep temp files on client system at the bare minimum. However, XULRunner must be run from local folder and would make problems if run from read-only medium. Because of this, upon autorun, XULRunner is unpacked from slideCD medium to `%TEMP%` folder, along with supplied plugins. Archive containing XULRunner is separated from compiled autorun `.exe`, in order to make upgrade trivial. You can find XULRUnner copy inside `xulrunner.tgz` in `\slideCD` folder. Be sure to pack it using TAR GnuZIP compression.

Upon start, XULRunner will generate its default profile folder under appropriate `%APPDATA%` folder (similar to Mozilla Firefox), and execute the slideCD XUL app. On exit, purge script will be executed, and this will erase XULRunner from `%TEMP%` folder and remove accompanying plugins. This script will not, however, remove XULRunner profile folder. It is rather small, and will enable slideCD to start faster next time.

## Content

Since content is displayed in Gecko powered browser (currently v1.9.0.3), everything HTML worthy is supported (e.g. Javascript). I tested complicated Javascripts, embedded Flash movies, linked CSS styles, etc.

Only downside is that your content must be statical and you must pay attention to use only relative paths for local content (which you, as a responsible programmer, already use). Dynamic web sites/presentations can be easily converted to static versions using programs such as wget and curl. I already made several slideCD’s of the websites I created, for offline viewing, using wget.

Content should be stored inside the `\slideCD\html` folder, but this is highly optional, since you may move it to some other location of your choice. Upon start, slideCD will navigate to the index.html file in the root of the slideCD medium. In default distribution, this file will self refresh and redirect to the `\slideCD\html\index.html`, but you could change this and add custom location in the appropriate META tag.

You can also specify some online content, buy entering full qualified `http://` address in META tag. This, of course, implies that the client system must have internet access, otherwise, browser will raise an error.

Since slideCD runs in kiosk (fullscreen) mode, there is no way for users to quit the program themselves. Keyboard shortcut for this action is available (`Ctrl+W`), but you must inform users about it. Easiest way would be to include in your content a intuitive link (big red X in upper right corner for example) which will enable users to close slideCD. This is easily done by using javascript link below:

```html
<a href="javascript:self.close();">Close this window</a>
```

### Examples of HTML content

<PhotoAlbum id="SlideCDExamples" />

## To do...

Since XUL is cross-platform, I intend to include the XULRunner for Linux and Mac OS X on slideCD somewhere in the future. This will ensure that the content is displayed exactly the same on all platforms. Missing autorun options on these systems will complicate this idea, but I’ll settle for simple double click on appropriate icon. Also, Gecko/XULRunner is upgraded regularly (current version being 1.9.1), and I will try to keep up with this.

## Source code

Complete [source code](https://github.com/dvuckovic/slideCD) for this app was written in XUL & NSIS. A copy of XULRunner is also included.
