---
title: My astrophotography setup
image: https://cdn.dvuckovic.com/posts/_MG_4482_header.jpg
summary: A custom amateur astrograph
date: 2011-01-30
tags:
  - post
  - astronomy
  - astrophotography
  - telescope
readingTime: 8 minutes
---

Cold (-6°C cold) weather, frozen snow all around and moderate, but pretty chilly wind sometimes can not deter determined amateur astronomer to go outside. This was the case over the weekend, when I set out with a friend to our regular observation spot, after weeks of _ugly_ weather, to finally test a working astrophotography setup. It was a short and quick test, with great results: everything worked as expected!

We weren’t able to produce a table for all of our equipment, because recent snow, followed by prolonged cold weather had deemed this mission impossible. So, we improvised, and laid out everything on a hood of the car we brought. It was all angled and slippery, but did the job.

![Full astrophotography setup on the hood of a car](https://cdn.dvuckovic.com/posts/_MG_4471.jpg)

## Magzero MZ-5m

Test was all about new guiding camera, one [Magzero MZ-5m](http://www.magzero.it/MZ-5m_EN.htm) (based on [QHY5 Guider Cam](http://www.qhyccd.com/QHY5.html)), which was purchased recently by my friend, in order to replace a modified Philips SPC-900NC webcam. Webcam coupled with ill-optics on 80/400 performed very badly, and wasn’t able to adequately serve as a guiding imaging sensor.

![MagZero MZ5m (QHY5) on the 80/400](https://cdn.dvuckovic.com/posts/_MG_4487.jpg)

Magzero came with a 1.25" eyepiece adapter, but this wasn’t needed because 80/400 has a nice M42x0.75 thread on the end of focuser which corresponds to the one on the insides of camera, so we were able to attach the camera directly to the tube.

Camera has it’s own driver, which is not compatible with WDM drivers in Windows. It works very well inside it’s own software, but it’s limited to capturing video from it: we needed it to serve as a guiding cam. Luckily, there is a working ASCOM plug-in bundled with the camera, which works very well in ASCOM enabled guiders (e.g. [PHD Guiding](http://www.stark-labs.com/phdguiding.html)). I was amazed to how scarce the configuration was (only two parameters: exposure and gain), but the camera works very well even without anything else. I have yet to succeed to make it works with Guidemaster and Metaguiding, but PHD will do nicely for the time being.

## Changing the piggy-back method

When I bought the 80/400 guiding scope, I used a photo tripod head to mount the scope to the main 150/750 instrument. This had some advantages, such as quick release system, but it wasn’t that sturdy: a fault that was exposed during earlier tests. Removal of the rubber on the quick release plate seemed to help a little, but it became apparent a new mounting method was needed.

In my earlier panorama escapades, I purchased a Manfrotto 438 Compact Leveling Head, which wasn’t that essential to panorama shooting (I managed to do it with a compact ball head). It has a much lower profile than a regular photo head, and seems much sturdier and stable. I mounted a quick release plate system on it, in order to maintain the ability to quickly disassemble the whole system.

![Manfrotto 438 Compact Leveling Head on top of 150/750](https://cdn.dvuckovic.com/posts/_MG_4492.jpg)

Leveling head has ±10° tilt range, more than enough for finding a guide star, since new Magzero camera has long exposure mode.

## Electronics

My EQ-6 mount didn’t come with an autoguiding feature, so modifying it for it was always on one mind. Luckily, my good friend developed and built an [LX200 protocol autoguiding system](http://www.nfilipovic.com/electronics/lx200-autoguiding) for an earlier setup, and because it wasn’t current any more, he set out to modify it to be compatible with the EQ-6 mount.

Since EQ-6 has built-in DEC motor, there wasn’t need for a custom one and DEC controller. Mount’s original hand controller was modified to be connected to the custom controller board, and supply it with power. Board also has an LX-200 enabled serial port, for computer connection. This brilliant design made it sure that the mount will be useful even without the astrophotography setup, because all original components could operate in their earlier mode.

I’m not that familiar with electronics, so my friend’s help was invaluable. As far as I managed to understand, whole system now relies on the controller inside the EQ-6 mount: new board simply passes the commands to the hand controller, by interpreting LX-200 protocol commands from the computer. It’s magic!

On the software side, I managed to get it to work using ASCOM LX-200 plug-in, so majority of programs supporting ASCOM platform are usable in this setup. System also works using direct serial port control, which some programs also support, so there is your fallback.

## Because we can!

As test progressed, I let the system guide on a star for some time, in order to generate a log file for detailed analysis. Then it was time for some utility testing, to see if some recent ideas can be brought to life.

### Wireless hand controller

Since the hand controller of EQ-6 mount was now utilized in guiding system, it became apparent that using it to fine tune the telescope will be extremely difficult because of all the cabling in and out of it. But the upside of this was the fact that computer now had the total control over the telescope, so if something could be used to control the computer...

I have an Android smart-phone, HTC Magic to be exact. It’s an older model (early adopter, sorry), but works well enough with the latest version of the OS and apps. I found [an app](http://en.android.collaud.net/multiremote) on the Market that can be used to make custom remote controller for the computer. It works with a custom Java server which runs on host system, and because my laptop can be made into a wireless hotspot, I can connect the phone with it over the Wi-Fi.

![Wireless telescope mount controller on Android](https://cdn.dvuckovic.com/posts/_MG_4477.jpg)

I used guiding software ([IRIS](http://www.astrosurf.com/buil/iris-software.html)), particularly its LX-200 command controller, by sending it specific keyboard shortcuts and voila: I now have wireless remote controller for the telescope on my phone! It is fairly reliable, even on larger distances (not sure I need that, but nevertheless ;)

![IRIS remote controller (MultiRemote)](https://cdn.dvuckovic.com/posts/snap20110204_100705.jpg#nozoom)

### Remote access

So it was a very cold night this weekend, but perfect for the last test: how to remotely access the system, from the warm insides of the house nearby?

Well, this was easy. Since [Connectify](http://www.connectify.me/) already enabled me to setup a wireless AP on the laptop, I was able to access it using an older notebook from the house. Using Remote Desktop, I was able to view and control it over the air. Implications of this system are numerous. One only need an Internet connection in order to turn this to a remote robotic telescope, but maybe later.

When I complete and connect the computer shutter release system for my DSLR camera, only things I will need to do on the outside will be focusing and framing of an object, in order to shoot it.

I love 21st century :D
