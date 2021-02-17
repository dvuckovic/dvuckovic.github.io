---
title: WSC.nConv
image: https://cdn.dvuckovic.com/projects/roman-numerals.jpg
summary: Windows Scripting Component for number-to-letters (BCS languages) and arabic-to-roman-numerals conversion
date: 2004-11-23
tags:
  - project
  - windows
  - jscript
readingTime: 5 Minutes
---

[WSC.nConv](https://cdn.dvuckovic.com/downloads/wsc-nconv.zip) is a Windows Scripting Component for number-to-letters (BCS languages, Bosnian/Croatian/Serbian) and arabic-to-roman-numerals conversion. nConv has only two methods and is easy to use and implement in different Windows Script languages (JScript, VBScript).

## Download

* [WSC.nConv](https://cdn.dvuckovic.com/downloads/wsc-nconv.zip)

## Requirements

* Windows Script Host

## Installation

Windows Scripting Component must be registered on the end user system, in order for windows script to be able to access it. Registration is easily achieved by right clicking the WSC file in Windows Explorer, and choosing "Register" from the context menu. Windows will then enter information about the component in the registry, and enable all windows scripts (whether they are written in JScript or VBScript) to create instances of it and use its methods. Syntax is almost the same, so following JScript example can be easily rewritten in VBScript.

![Register WSC](https://cdn.dvuckovic.com/projects/wsc-register.jpg)

## Usage

There is a `trynConv.js` file in ZIP distribution which demonstrates quickly the use of the class. Class is used in the following way:

```js
// nConv WSC Test
var nConv = WScript.CreateObject('WSC.nConv');

// n2L Test
num = 861475.13;
str = nConv.n2L(num);
WScript.Echo(num+' should be:\n'+str);

// n2R Test
num = 1888;
str = nConv.n2R(num);
WScript.Echo(num+'. should be:\n'+str);
```

Class has no properties as has following methods:

* `WSC.nConv.n2L(number)`

  This method returns string representation of `number` in BCS languages (Bosnian/Croatian/Serbian).

* `WSC.nConv.n2R(number)`

  This method returns `number` converted to roman numerals representation.
