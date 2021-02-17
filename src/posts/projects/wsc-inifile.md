---
title: WSC.INIFile
image: https://cdn.dvuckovic.com/projects/algorithm.jpg
summary: Windows Scripting Component for reading/writing local INI files
date: 2003-05-24
tags:
  - project
  - windows
  - jscript
readingTime: 5 Minutes
---

WSC.INIFile is a Windows Scripting Component for reading/writing local INI files. It employs [WSC.File component](/2003/11/22/wsc-file/) to read/write specified INI file and offers procedural access to the INI file for variables and values. It supports standard Windows INI file syntax, along with sections.

## Download

* [WSC.INIFile](https://cdn.dvuckovic.com/downloads/wsc-inifile.zip)

## Requirements

* Windows Script Host
* [WSC.File component](/2003/11/22/wsc-file/)

## Installation

Windows Scripting Component must be registered on the end user system, in order for windows script to be able to access it. Registration is easily achieved by right clicking the WSC file in Windows Explorer, and choosing "Register" from the context menu. Windows will then enter information about the component in the registry, and enable all windows scripts (whether they are written in JScript or VBScript) to create instances of it and use its methods. Syntax is almost the same, so following JScript example can be easily rewritten in VBScript.

![Register WSC](https://cdn.dvuckovic.com/projects/wsc-register.jpg)

## Usage

There is a `tryINIFile.js` file in ZIP distribution which demonstrates quickly the use of the class. Class is used in the following way:

```js
var myINI = WScript.CreateObject('WSC.INIFile');
var shell = WScript.CreateObject('WScript.Shell');
myINI.open('test.ini');
shell.Popup('Value of variable3 in Section1 is: '+myINI.getValue('Section1','variable3'),0,'tryINIFile');
myINI.getValue('Section1','variable9');
myINI.setValue('Section1','variable9','value9');
shell.Popup('Value of variable9 in Section1 is: '+myINI.getValue('Section1','variable9'),0,'tryINIFile');
myINI.getValue('Section3','variable10');
myINI.setValue('Section3','variable10','value10b');
shell.Popup('Value of variable10 in Section3 is: '+myINI.getValue('Section3','variable10'),0,'tryINIFile');
```

Class has no properties and has following methods:

* `WSC.INIFile.open(fname)`

  This method opens the INI file named `fname` and process it for existing variables and their values.

* `WSC.INIFile.getValue(section, varname)`

  This method returns the value for variable `varname` in `section` of the opened INI file.

* `WSC.INIFile.setValue(section, varname, value)`

  This method writes/changes `value` of the variable `varname` in `section` of the opened INI file.
