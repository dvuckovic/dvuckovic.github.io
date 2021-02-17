---
title: Panoramic head (v1.0)
image: https://cdn.dvuckovic.com/panoramas/test/preview/test-1.jpg
hideImage: true
summary: My quick-n-dirty DIY panoramic head, made from two old flash brackets
date: 2007-03-08
tags:
  - project
  - diy
  - photography
readingTime: 10 Minutes
---

_UPDATE: Take a look at [my revised version of panoramic head](/2011/03/21/panoramic-head-v2/). This one is much more sturdy and incorporates several professional Manfrotto elements._

Well, making the head took some time. Not because it was complicated, but because I had to find all those parts to put it together. First idea I got from my friend (professional photographer) who made the head from the scratch to carry much larger and heavier camera than mine. I have Canon EOS 350D which is pretty lightweight for a DSLR and after some thinking I concluded that making the head would be fairly simple.

![Panoramic head](https://cdn.dvuckovic.com/projects/panorama-head-1.jpg#nozoom)

Main concept and idea is similar for most of the heads: two axis stand to carry a camera and make it possible to rotate camera in the plane of the primary lens. This will allow the camera to take all the pictures from correct pivot point and make easier for software to stitch them all together (this pivot point is defined as the exact center of the lens’ entrance pupil). For the sake of easier photography there should be also two measurements: altitude angle between the two axes for vertical overlapping and azimuth angle for horizontal overlapping.

![Panoramic head](https://cdn.dvuckovic.com/projects/panorama-head-2.jpg#nozoom)

I used two old flash brackets that were laying around (actually one was just lying around and the other I found at the photo market). They were perfect for this as they already had tunnels for photo thumb screw and one of them was perfectly L shaped. I connected them using a simple round-head screw and wing nut. It allowed me to change their angle by simply loosening the screw and rotating the smaller I bracket. The L bracket was also drilled and threaded with 1/4" screw thread in order to attach it to regular photo tripod head.

I also added a small inclinometer to check for planar consistency during rotation before taking pictures. I will later find out that it is not critical to align the whole panoramic head perfectly horizontal because any variation (of horizon rotation) can be easily adjusted in stitching software. At least the head now looks pretty cool, almost professional :)

## Taking Pictures

Once the head was complete, it was the time to test it. Test subject was [my room](/2007/03/08/test-panorama-my-room/). Since I have just 18mm lens that shipped with the camera, my field of view was preety narrow for making panoramas. When calculated, I needed 38 (!?) single shots in order to complete the full sphere (360°x180°) panorama. This was the way more images than my friend the photographer needed (just six), but I was reluctant to give up.

Considering that I needed the full panorama I set the camera in manual mode: fixed manual focus, aperture and exposure and custom white balance for my room (I wanted to have as white walls as possible). I took the shots in the following order: first the base shot (-90°), then 12 shots at -45°, then 12 at 0°, then 12 at 45° and finally the zenith shot (90°). I used the 12-step division on the photo tripod’s rotating gauge as markers, and pre-measured angle for the position of the altitudal I bracket. It was a painful process, but after a 10-15 minutes I made it.

## Putting it Together

First, I used PTGui demo for the stitching. It pleasantly surprised me by automatically reading the correct lens settings from the EXIF of each file. It also managed to very correctly calculate control points for most of the images. I only had to define control points for the zenith shot (that was expected). After removing the blurred tripod image from the base shot I just hit the button for generating panorama. After some tests and tuning I ended up with full scale equirectangular panorama in lossless 16-bit TIFF format (`17000x8000px` = that’s `145MP` folks!).

When resized to more or less normal resolution, I put the TIFF in the Pano2VR program which exported it back in Quicktime QtVR and Adobe Flash container. Flash panoramas are a bit newer way to display this kind of panoramas and although they had some issues in infancy (a little bit jumpy and lower in quality), they came a long way and are now perfect way of displaying vr panoramas. Quicktime (QtVR) is definitely higher in quality, but lack of market penetration and huge installation took it’s toll.

Recently I stitch panoramas in _hugin_ (with the _enblend_ filter), because it’s open source. HDR imaging is now a must, because panoramas usually have higher dynamic range than normal photography, because of complex scene lighting. Individual shots are stitched with their same exposure counterparts, and you end up with one panorama for each exposure. These panoramas are then converted to HDR, and tonemapped in any of HDR capable software (e.g. _enfuse_).
