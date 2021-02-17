---
title: WSC.PostScript
image: https://cdn.dvuckovic.com/projects/typography.jpg
summary: Windows Scripting Component for reading/writing PostScript (PS) files
date: 2003-05-24
tags:
  - project
  - windows
  - jscript
readingTime: 5 Minutes
---

WSC.PostScript is a Windows Scripting Component for reading/writing local PostScript (PS) files. It employs [WSC.File component](/2003/05/24/wsc-file/) to read/write PS files and offers procedural access to some common PS tasks and procedures.

## Download

* [WSC.PostScript](https://cdn.dvuckovic.com/downloads/wsc-postscript.zip)

## Requirements

* Windows Script Host
* [WSC.File component](/2003/05/24/wsc-file/)

## Installation

Windows Scripting Component must be registered on the end user system, in order for windows script to be able to access it. Registration is easily achieved by right clicking the WSC file in Windows Explorer, and choosing "Register" from the context menu. Windows will then enter information about the component in the registry, and enable all windows scripts (whether they are written in JScript or VBScript) to create instances of it and use its methods. Syntax is almost the same, so following JScript example can be easily rewritten in VBScript.

![Register WSC](https://cdn.dvuckovic.com/projects/wsc-register.jpg)

## Usage

There is a `tryPS.js` file in ZIP distribution which demonstrates quickly the use of the class. Class is used in the following way:

```js
// PostScript WSC Test
var ps = WScript.CreateObject('WSC.PostScript');
ps.initPS('test.ps');
ps.coord(90,20,90,75);
ps.thickness(0.1);
ps.color(0,0,0,100);
ps.circle(20,20,2);
ps.endPS();
```

All units are entered in millimeters (mm), which are defined in 72dpi resolution (1 mm = 1/25.4 x 72 pt). Class has no properties and has following methods:

* `WSC.PostScript.initPS(fName, xl, yl, xu, yu)`

  This method initializes EPS file named `fname` and sets boundaries to `xl`, `yl` (bottom left corner) and `xu`, `yu` (upper right corner).

* `WSC.PostScript.coord(xc, yc, xx, yx)`

  This method sets coordinate origin to `xc`, `yc` for all subsequent methods, and rotates the coordinate system using the x-axis point located at `xx`, `yx`.

* `WSC.PostScript.line(x1, y1, x2, y2)`

  This method draws a straight line from point `x1`, `y1` to point `x2`, `y2`.

* `WSC.PostScript.rectangle(x1, y1, x2, y2)`

  This method draws outlined rectangle from point `x1`, `y1` (bottom left corner) to point `x2`, `y2` (upper right corner).

* `WSC.PostScript.circle(xc, yc, r)`

  This method draws outlined circle whose center is located at `xc`, `yc` and whose radius is `r`.

* `WSC.PostScript.thickness(thick)`

  This method sets outline thickness to `thick` value. Outline of all subsequent objects will have this thickness.

* `WSC.PostScript.style(stroke, space)`

  This method sets dashed outline style using `stroke` and `space` values for all subsequent objects. Invoke this method with stroke and space set to null to clear dashed space setting.

* `WSC.PostScript.color(cyanred, magentagreen, yellowblue[, black])`

  This method sets current color to supplied values. If black is set to other than `null`, color will be set in CMYK, otherwise RGB color space will be used.

* `WSC.PostScript.fill()`

  This method fills last drawn object using the current color value.

* `WSC.PostScript.font(fontname, size)`

  This method sets current font to `fontname` in `size`. Keep in mind that PS file won’t have embedded fonts by default, if you want to use custom font, be sure to embed it in PS file (try using `eval` method).

* `WSC.PostScript.text(x, y, string)`

  This method outputs `string` at coordinates `x`, `y` using the current font and color.

* `WSC.PostScript.eval(code)`

  This method inserts additional PS code in PS file. Keep in mind it will not be validated for syntax errors, so be sure to clean up any errors before you insert it. Use `\n` for line breaks.

* `WSC.PostScript.endPS()`

  This method finishes up PS output and closes PS file. This method is mandatory, in order to produce valid PS file.
