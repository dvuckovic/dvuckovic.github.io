---
title: myDistillerAssistant
image: https://cdn.dvuckovic.com/projects/pdf.jpg
summary: Small installer for tweaking Adobe® Acrobat® Distiller® installations on Microsoft® Windows®
date: 2009-06-29
tags:
  - project
  - dtp
  - windows
readingTime: 15 Minutes
---

_UPDATE: With the release of Acrobat® 9, I tested myDistillerAssistant, and it worked fine. However, when CS4 was released I noticed that my job settings file was giving InDesign trouble (it failed to start correctly!). I rebuilt my job settings file from inside the Acrobat® 9, and the bug was resolved. Bottom line: myDistillerAssistant is now CS4 compatible!_

![myDistillerAssistant](https://cdn.dvuckovic.com/projects/mydistillerassistant.png#icon#nozoom)

myDistillerAssistant (revision 2.4) is a small installer for tweaking Adobe® Acrobat® Distiller® installations on Microsoft® Windows® in order to produce reliable and high quality Adobe® PDF output using Distiller®’s PDF printer. It will optimize your Distiller® installation by adding a set of startup scripts and setting custom job settings for backward compatible and offset press quality PDF files.

## Download

* [myDistillerAssistant.exe](https://cdn.dvuckovic.com/downloads/myDistillerAssistant.exe)

## History

While working at a local printing shop (dtp/prepress operator), I ran into a problem with receiving printing files from numerous clients that were just impossible to produce. Since many of these clients had unskilled operators that were unfamiliar with printing techniques and prepress tasks, files were non-standard, often in a wrong color space and difficult to print (e.g. small fonts in rasterized format). Producing Adobe® PDF files using Distiller®’s PDF printer came as a natural solution to this problem, since all programs with a simple print dialog could be used. However, complex and confusing Distiller®/Adobe® PDF printer was difficult to configure and setup, and I often got PDF files produced with a default settings that were also unsuitable for printing.

## Components

A while back, company Creo made a set of scripts for Distiller® ([CreoDistillerAssistant](https://www.google.com/search?q=CreoDistillerAssistant)) aimed at optimizing and cleaning up PostScript® files from usual mistakes and errors produced by non-standard, and sometimes, industry-standard programs (e.g. QuarkXPress). These scripts proved very useful when working with older, not-so-much compatible RIPs, which were often crashing and producing bugs when they come accross these errors. Installation of these scripts was manual (copying files in certain folder), so automatic installation was preferable.

Default settings for producing PDF files using Adobe® PDF printer was (and in modern versions, still is) ill-fated "Standard" option, which creates files suitable only for viewing/web use. If by any chance you try to send CMYK material to the PDF printer, it will convert all colors to sRGB model, thus rendering final PDF file unusable for industry standard printing. Also, it has a nasty option to keep some common fonts from embedding, which can impact on how the text is formatted and flowed in a file. Other options, beside this default, that come with Distiller® also have some drawback, so the easiest thing to do was to create a common job settings (`joboptions`) file with all the right options and settings, and install it and use it with every Distiller® installation, which will be used in producing suitable printing files.

Job settings file was suitably named `jobOptions.joboptions` and included following options:

* Compatibility: **Acrobat 4.0 (PDF 1.3)**
* Resolution: **2400dpi**
* Default Page Size: **210x297 mm (A4)**
* Embed thumbnails: **On**
* Image resolution: **Bicubic Downsampling** to **600dpi** for images above **900dpi**
* Image compression: **JPEG Maximum** (for monochrome images: **CCITT Group 4**)
* Embed all fonts: **On**
* Subset embedded fonts: **Off**
* When embedding fails: **Cancel job**
* Never Embed: **Empty**
* Color Management Policies: **Leave Color Unchanged**
* Document Rendering Intent: **Preserve**
* All other settings: **Default**

If you want, you can download [job settings file](https://cdn.dvuckovic.com/downloads/jobOptions.joboptions) only (use right click > Save Link As, since it’s a text file).

As you can see for yourself, color management policy was to "Leave Color Unchanged", that is, color space was to be preserved from original program. This way, if I got an RGB file, instantly I knew that the client was working with a wrong color space to begin with, so a simple telephone call ("Change it to CMYK") was enough. More serious programs (like Photoshop, Illustrator) have better color space conversion algorithms with more control, so it is better to do the conversion in them, while still working on a project.

## Installer

I made a setup/installation program in [Nullsoft Scriptable Install System (NSIS)](https://nsis.sourceforge.net/), version 2. This way, a small, compact, setup-like procedure was used, along with an uninstall option if needed. On startup, installer looks for the Adobe® Acrobat® installation, and tries to detect certain installation folders on your system. If unsuccessful it will provide a way to manually enter paths to appropriate folders. Detection works with every release of Acrobat® since version 4 to the version 8 (CS3) 9 (CS4). In second revision I’ve added the CS3 support, since the folders were relocated in this version, and even protected with NTFS permissions. If installer detects more than one installation of Acrobat®, only the most recent one installed will be selected, with a possibility to change the folders to some other installation.

Beside the Creo’s scripts and my job settings file, originally I included a small PDF containing general prepress instructions and right procedures for obtaining a good PDF from some programs (Photoshop, Illustrator, InDesign, QuarkXPress) using print to PDF method. It is excluded from this revision since it was aimed primarily at the clients of my printing shop.

## Source code

Complete [source code](https://github.com/dvuckovic/myDistillerAssistant) for installer was written in NSIS. Original CreoDistillerAssistant is also included.
