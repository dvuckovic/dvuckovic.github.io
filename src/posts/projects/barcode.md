---
title: barcode
image: https://cdn.dvuckovic.com/projects/barcode.jpg
summary: PHP script for fast batch generation of EAN-13 barcodes from the given range in monochrome (bitmap) TIFF format
date: 2006-02-09
tags:
  - project
  - php
  - dtp
readingTime: 15 Minutes
---

barcode is a PHP script for fast batch generation of EAN-13 barcodes from the given range in monochrome (bitmap) TIFF format. It employs a barcode class from _Jean-Sebastien Goupil_ and ImageMagick’image command line processing.

## Download

* [barcode-v1.0.zip](https://cdn.dvuckovic.com/downloads/barcode-v1.0.zip)

## Requirements

* PHP v4 or higher
* ImageMagick’v6 or higher

## Background

Working in a print shop, we strived to develop and implement reliable way for processing print jobs, using barcodes on job folders. This way we could track a job in every stage of production. One of the problems was fast and unique barcode generation, which was also suitable for web server implementation, since tracking application was implemented as an intranet web application.

Finding the barcode PHP class was an easy task, but tweaking it to produce compact monochrome TIFF files suitable for printing was somewhat tricky. Finally, I remembered that ImageMagick’suite has image command processing function, so I called it from the script for each barcode generated

## Script logic

Script uses a "for" loop to iterate barcodes. Since I used only EAN-13 barcodes, I split the 12-byte code in different sections, for an easier management.

```
 468   0001  00001     6
------ ----- ------ -------
prefix  infix  suffix  control
```

* `prefix` - suitable for client string (3-bytes)
* `infix` - suitable for job description (4-bytes)
* `suffix` - actual iterator for different job stages or combinations (5-bytes)
* `control` - EAN-13 has 12-byte code, 13th byte is control code

Script iterates the suffix and generates appropriate RGB .PNG files, one at a time. Code than calls ImageMagick’s convert command and outputs LZW compressed TIFF in a subfolder. At the very end, a text file named `list.txt` is written, which contains all generated files/barcodes, for an easier insertion into a table/database.

![Sample barcode](https://cdn.dvuckovic.com/projects/barcode.png#rect#nozoom)

Script is the fastest thing I could come up with, with about 100 barcodes every 5s on dual-core processor. If called from the command line (`php -f` command), it displays progress bar with exact time needed for each segment, so you can keep track of it and know where it is. Barcodes in monochrome TIFF format are suitable for wide range of CMYK and RGB enabled printers, and LZW compression makes them very very small (only **407** bytes per barcode). Monochrome images are easily scaled, since virtually every application scales them using nearest neighbor algorithm.
