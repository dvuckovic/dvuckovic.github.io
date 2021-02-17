---
title: Autoguiding test
image: https://cdn.dvuckovic.com/posts/composit-120x10_header.jpg
summary: Still room for improvement
date: 2011-07-27
tags:
  - post
  - astrophotography
  - astronomy
  - telescope
readingTime: 30 minutes
---

This is a result from a recent test of my autoguiding setup. I wrote [before](my-astrophotography-setup) about the whole astrophotography setup and this was supposed to be first real-life test of autoguiding while attempting to shoot something. Results are somewhat disappointing, there is still room for some improvements, especially on the level of hardware sturdiness. Later in the post I will layout a recipe for basic DSLR astrophotography processing in [IRIS](http://www.astrosurf.com/buil/us/iris/iris.htm) program.

## Setup

First, let’s take a look at the whole setup. For some images, please take a look at my [previous post](my-astrophotography-setup).

Main instrument (used for shooting) consists of:

* Skywatcher Newton 150/750
* Skywatcher EQ-6 mount
* Canon EOS 350D camera body
* Remote controller for camera
* [T2](http://en.wikipedia.org/wiki/T-mount) to [EF](http://en.wikipedia.org/wiki/Canon_EF_lens_mount) lens mount adapter

Guiding equipment includes following:

* Skywatcher OTA refractor 80/400
* Magzero MZ-5m camera
* T2 mount extender tube
* Custom controller board (LX200 guiding standard, with interface for EQ-6)
* A laptop :)

Using small finderscope in this setup (I have two of them) proved to be somewhat difficult, because of the piggy back method for the guide scope. Something more rudimentary might help in the future (simple guide rail?), but for now I decided to remove them.

After the quick polar alignment, I pointed the instrument on [Mizar-Alcor system](http://en.wikipedia.org/wiki/Mizar_and_Alcor), since this was a perfect candidate for a test (and in no small part because of a limited view from my backyard :). Then I mounted the DSLR and focused the stars using a viewfinder magnifier. Guide scope was also pointed to Mizar-Alcor, with Magzero attached. After everything was connected with inevitable cables, autoguiding was next.

## Autoguiding

Autoguiding works on a principle of feedback: camera on the guide scope feeds an image of starfield to the computer, which in turn analyze relative position of a guide star over time. Then it signals small correction to the mount based on the star’s drift, in order to keep the guide star steady.

Axis on the guide image should be calibrated, so that _x_ corresponds to the _RA_, and _y_ to the _Dec_. This is easily done by slewing the mount and then rotating the camera on the guide scope. This way guiding software can separate the errors, and improve accuracy.

I tried experimenting with an additional **Barlow lens** (2.5x), because focal length of the main instrument is twice that of the guide scope, hence smaller error in guiding translates in a bigger in shot. But this proved to be counter-intuitive: for some reason, I had bigger errors while using the Barlow lens. Until this is sorted, I reverted to guiding with a smaller focal length.

## Shooting

Recently I made a remote controller for EOS 350D, in order to be able to remotely control the shutter. This is a simple **RS232** adapter, and deserves a post of it’s own, soon. This way my exposure times are more precise, and eliminates the need of manual time keeping. Also I can trigger the camera from the inside of my home, but that’s irrelevant ;)

The whole test was a little bit under two hours, so after it I shot some dark frames and was good to go.

## Processing

For DSLR processing my friend developed a recipe for [IRIS](http://www.astrosurf.com/buil/us/iris/iris.htm). It’s rather complex program, but very powerful because most processing is done on a low-level. So let’s see what steps are necessary for a basic composite image.


### White balance

First, the dreaded white balance. For this you need several images containing a pure white object, which had been correctly exposed. I had some images of people in white shirts, which is convenient because you can check the final result by looking at the color of the skin (easiest to see if it is correct).

To load image, you use **File>Load...** and select a RAW file. Next, select an area on the image which should be pure white (larger than 100x100px), and in **Command** window type:

```
>white
```

In Output window you should now have three factors (**R**/**G**/**B**, **G** is always 1.0 for Bayer matrices). Take a note of them, and proceed to do this an all images. Then, calculate average values for each channel, and enter them in **Camera settings** dialog, and keep **Apply** checkbox on.

### Preprocessing

Now we need to convert RAW files to an internal format which has 48bit dynamic range (16bit per channel!). In the end I had about 10 usable shots, all taken with ISO100 and 120 sec exposure time. Also I had only three dark frames, sadly with different exposure times (we will make most of this, later). Lastly, I did not have time for some flat field frames, so I opted to use a generic one.

To convert all these to **CFA**, first check if you’re using **PIC** file format (in **File>Settings...**). Then **Digital photo>Decode RAW files...** Drag and drop the files in window, put `img` as **Name**, and then press **->CFA**...

Do this for all dark frames (**Name** them `dark`), and flat fields (**Name** them `flat`) if you have them.

### Dark frame

First, we must expand the dynamic range of each file, in order to make the most of the new file format. This is done by the following command:

```
>mult2 dark dark 4 3
```

We multiply each file (**3** of them) by **4**. Next, if you didn’t managed to shoot all the frames with the same exposure time, you must normalize before averaging them.

I had one dark frame with correct exposure time (120 sec), and two with longer one (one with 180 sec, and one with 300 sec). To calculate the factors, simply divide the right exposure time with wrong one, e.g.:

* for second dark frame: 120/180 = **0.67**
* for third dark frame: 120/300 = **0.4**

Now let’s normalize. First load the appropriate **dark** frame, multiply it with the correct factor and save it in the end:

```
>load dark2
>mult 0.67
>save dark2

>load dark3
>mult 0.4
>save dark3
```

Finally, let’s average them:

```
>smedian2 dark 3
>save dark
```

Now, the file dark contains the average **dark** frame which we will use in processing.

### Main images

For **main** images, we also have to expand the dynamic range, hence:

```
>mult2 img img 4 10
```

The 10 at the end is because we have 10 main frames, remember?

For a **flat** field you should do the same as for **dark** frames, averaging them. However, I didn’t have time for them, so I made a generic one. Simply load one expanded main image, find **median** value in output window, fill it and save it:

```
>load img1
>stat
>fill 1038
>save flat
```

Now, we are ready for correcting the main images:

```
>pr img dark flat out 10
```

This command subtracts **dark** and **flat** frames from our main images and outputs appropriate out files. From now on we must abandon Bayer matrix and use the demosaic algorithm, because it’s time for some color.

### RGB conversion

To convert all our **out** images to RGB, we will use sequence conversion. Load the dialog by **Digital photo>Sequence CFA conversion...** and set the **Generic input name** to **out**, **Generic output** to **outrgb** and **Number** to correct number of images (in this case **10**). This process uses the white balance factors mentioned earlier, but don’t be surprised if the color isn’t that faithful (mine wasn’t). It’s very hard to pick the right white balance in the first try.

_UPDATE: I’m not sure why, but apparently **Sequence CFA conversion...** option in IRIS does not apply white balance corrections automatically, despite Apply checkbox being active in Settings (perhaps a bug?). So, after CFA conversion be sure to apply correct white balance by issuing following command:_

```
>rgbbalance2 outrgb outrgbwb 1.472 1.000 1.557 10
```

_where **1.472 1.000 1.557** are previously calculated R/G/B factors, respectively. And then register using these new images by substituting outrgb filename with outrgbwb in next command._

### Registration

Now it’s time to register the image and cancel any movement that might occurred between them. To do this, first find a lone star near the center of the frame, select a larger area around it (should contain only one star) and type the following command:

```
>register outrgb outrgb_r 10
```

Substitute the **10** for the correct number of images.

### Compositing & white balance correction

Now that we have registered RGB images, it’s time for a composite image, but first let’s separate channels because of an additional white balance correction.

Go to **Digital photo>Sequence RGB separation...** and set the **Generic name** to outrgb_r. RGB sequence should be set to:

* **Generic R:** outr
* **Generic G:** outg
* **Generic B:** outb

...and **Number** to **10** or whatever.

Now for the composites:

```
>composit outr 3 3 1 10
>save composit_r

>composit outg 3 3 1 10
>save composit_g

>composit outb 3 3 1 10
>save composit_b
```

Be sure to write down factors that composit command outputs for each channel. The smallest one will be our baseline for normalization. Again, divide the smallest numbers with each of the others and take a note of values.

E.g. green number was 0.400. Red was 0.411 and blue 0.402. So, the new factors are:

* for red channel: 0.4/0.411 = **0.973**
* for blue channel: 0.4/0.402 = **0.995**

Next, open the file for each channel and multiply it by a calculated factor:

```
>load composit_r
>mult 0.973
>save composit_r

>load composit_b
>mult 0.995
>save composit_b
```

Finally, composite image in color:

```
>tr composit_r composit_g composit_b
```

And for a PSD output file:

```
>savepsd composit
```

That’s it! We’re done with IRIS.

### Photoshop processing

When you open the PSD output file in Photoshop, you will notice it is rather dull, but remember that it has a far greater dynamic range than your monitor!

First, let’s use **Levels** to truncate upper part of the image. Note the value of the brightest pixels (e.g. **125**), add about 20% (**150**) and write this value to upper input box. This headroom is necessary, because we will be using some additional commands later.

![Levels](https://cdn.dvuckovic.com/posts/dslr-photoshop-levels.jpg#nozoom)

Now for the **Curves**. We will be applying [a ln2() logarithmic tone curve](https://cdn.dvuckovic.com/downloads/ln2-logarithmic.acv) or [a simple lighten tone curve](https://cdn.dvuckovic.com/downloads/lighten-2.acv), twice in a row. This should bring tones to about final ones, but this vary greatly among different images. Nebulas tend to be unforgiving to these curves, so apply only if it brings the image to a better level. Don’t waste information!

![Curves (lighten-2)](https://cdn.dvuckovic.com/posts/dslr-photoshop-curves.jpg#nozoom)

In the end some contrast, again using **Curves**, should be applied. Again, this vary across different types of images.

![Curves (contrast)](https://cdn.dvuckovic.com/posts/dslr-photoshop-curves2.jpg#nozoom)

Generally, any kind of touch up you do to the astro-image is OK, as long as the reality is respected. If you need to remove some hot pixels that did not made the cut, then by all means! Also, color/brightness/contrast correction is also completely ethical, just don’t try to erase/move/add stars or objects ;)

Finally, be sure to crop your image, because almost certainly registration will somewhat make the usable image smaller (depending on how much your original frame has drifted along the session).

Resulting full-res image you can view below. Aside from a considerable comma (which was expected), focus is a touch from ideal position, and also guiding wasn’t perfect (see that potato shaped star). You can barely see separation between Mizar components, but this is too small focal length for this kind of gap. All in all, it’s acceptable, but, as I said, there’s always room for improvement.

![Composite](https://cdn.dvuckovic.com/posts/composit-120x10.jpg)
