---
title: WSC.File
image: https://cdn.dvuckovic.com/projects/files.jpg
summary: Windows Scripting Component for intuitive I/O operations using FileSystemObject
date: 2003-05-24
tags:
  - project
  - windows
  - jscript
readingTime: 5 Minutes
---

WSC.File is a Windows Scripting Component for intuitive I/O operations using `FileSystemObject` (FSO). FSO ships with Windows Script Host and serves as a basic file I/O class, but it’s usage is non-intuitive and often confusing. WSC.File is a class that tries to simplify usage of FSO, by offering intuitive methods and parameters.

## Download

* [WSC.File](https://cdn.dvuckovic.com/downloads/wsc-file.zip)

## Requirements

* Windows Script Host

## Installation

Windows Scripting Component must be registered on the end user system, in order for windows script to be able to access it. Registration is easily achieved by right clicking the WSC file in Windows Explorer, and choosing "Register" from the context menu. Windows will then enter information about the component in the registry, and enable all windows scripts (whether they are written in JScript or VBScript) to create instances of it and use it’s methods. Syntax is almost the same, so following JScript example can be easily rewritten in VBScript.

![Register WSC](https://cdn.dvuckovic.com/projects/wsc-register.jpg)

## Usage

There is a `tryFile.js` file in ZIP distribution which demonstrates quickly the use of the class. Class is used in the following way:

```js
var file = WScript.CreateObject('WSC.File');

file.open('hello_world.txt','read');
var str = '';
while (!file.eof)
    str += file.readLn() + '\n';
file.close();

WScript.Echo(str);
```

Class has a following property:

* `WSC.File.eof`

  This boolean will return "true" if the end of file (EOF) is encountered during file processing.

Class has following methods:

* `WSC.File.open(fname, iomode)`

  This method opens the file named `fname` in specified `iomode` (one of the following: `append`, `overwrite`, `read`).

* `WSC.File.readLn()`

  This method returns read line as string at the current pointer from the opened file.

* `WSC.File.writeLn(writetext)`

  This method writes supplied string parameter `writetext` at the end of opened file.

* `WSC.File.close()`

  This method closes the currently opened file.

If any errors are encountered, they will be logged at the end of file `errfile.err` in working directory.
