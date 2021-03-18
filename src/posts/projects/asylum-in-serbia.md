---
title: Asylum in Serbia
image: https://cdn.dvuckovic.com/projects/asylum-in-serbia-splash.jpg
summary: Android help app for refugees seeking asylum in Serbia
date: 2015-10-07
tags:
  - project
  - android
  - java
readingTime: 20 Minutes
---

It provides an aggregate of information regarding the asylum procedure, accommodation and service for migrants. Ordered by local NGO, app features modern Material Design, support for large device base, both offline and online data and integration with mapping services on Android devices.

<a href="https://www.apc-cza.org/" target="_blank" rel="noopener">
    <img src="https://cdn.dvuckovic.com/projects/asylum-in-serbia.png" width="200" />
</a>

## Mockup

Since this was a first Android project I actually billed (yaay!), I had to come up with some serious way to present design proposal for the app, before it was created. I heard about Sketch, but too late actually. In the meantime I found [Pixate](https://www.pixate.com/) and it looked like it could do a decent job. Tool is actually too simple, and some things are quite hard to achieve, or impossible. But I committed, and in a few days had a working prototype I could play on a device.

Most of the mockup is created with static images, so it’s a good base for initial design. But anything more complex, and you’re in for it. Fortunately, no further changes to the mockup were required, design was approved and development could begin.

<div style="margin-bottom: 40px;">
    <iframe frameborder="0" width="290" height="480" style="margin-right: 50px !important;" allowfullscreen="true" src="https://www.youtube.com/embed/AI9SVMNfvyA?rel=0"></iframe>
    <iframe frameborder="0" width="290" height="480" allowfullscreen="true" src="https://www.youtube.com/embed/_y32nxkun7E?rel=0"></iframe>
</div>

## Android Support Library

I’m no stranger to [support library](https://developer.android.com/tools/support-library/index.html), but last time I took a look at it (v4) it was quite limited and simplistic. It only featured port of Fragments for older Android devices. Well, it turned in quite a monster over the years, and while it definitely became easier to use it (with all the provided samples), it still has some childhood issues.

Originally, I decided to set API 7 as a minimum (since its support library’s minimum ATM). But this turned troublesome, since I planned also to use some additional libraries for web services. I settled finally for API 9, but I must say app looks barely usable on Gingerbread. While you target 98.8% devices per [Google’s Dashboards](https://developer.android.com/about/dashboards/index.html#Platform) page, most of the colors in the interface are wrong, there are bugs a plenty and it probably makes more sense to target API 17 or something similar.

But this project was a little bit special in that way that migrants might also have older devices on them, since their situation is difficult.

Support library is definitely the way to do it, but be advised that it has many bugs and is under heavy development. You will be spending your time lurking around Stack Overflow, and finally overriding their classes in order to squash the bugs :)

## Result

App can be downloaded from Google Play Store, as a free app:

<a href="https://play.google.com/store/apps/details?id=com.dvuckovic.asylumseeker"><img src="https://play.google.com/intl/en_gb/badges/static/images/badges/en_badge_web_generic.png" width="300" alt="Get it on Google Play"></a>

You will find the screenshots and a short demonstration video there too. Feel free to try it (even if you are not a migrant), and leave a comment.
