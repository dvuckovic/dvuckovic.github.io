---
title: Simple internet checker
image: https://cdn.dvuckovic.com/posts/internet-checker_header.jpg
summary: Automatic router restart in case you get offline
date: 2011-05-05
tags:
  - post
  - internet
  - dos
  - shell
  - script
readingTime: 15 minutes
---

In my corporate workplace we have a dedicated ADSL line for the Windows® mail server. As all connections go it’s a little buggy, so every now and then ADSL router locks up, mails stop flowing and the only thing that helps is the manual reboot of the router. Since this seems to happen only on the weekends and other non-working hours (Murphy’s Law?), the need arose for an automated solution to this problem.

My initial idea was for a small command line program that pings a server and takes an action if the ping fails. This is relatively easy to do, and since there are Scheduled Tasks available on the Windows® system, you can set this program to auto execute on some reasonable time interval.

Since this is only going to be used on Windows®, I decided that MS-DOS® Batch script should do the trick. Ping is already available in shell access (ping), and you can find plethora of different programs to help you make a normal HTTP request from the command line (e.g. wget, curl). Almost all routers nowadays have web-based administration interface, so, in theory, you can always simulate user rebooting the router by sending appropriate requests. Granted, some of these are more complex than others and may require sending a variable or two along with the request. One thing that always helped me when trying to figure out the correct sequence of events in these circumstances was Mozilla Firefox®.

Firefox® has several mind blowing add-ons/plugins, one of them being [Live HTTP Headers](http://livehttpheaders.mozdev.org/). Using it while rebooting the router in browser you can inspect all the requests interface makes in order to accomplish this: all the correct URIs, variables, etc. Also, it may help by looking at the source code of the page with the Reboot button: note the action in the FORM containing the button, almost always it is the correct URL of the page that process the request.

So, let’s take a look at [the script itself](https://cdn.dvuckovic.com/downloads/internet-checker.bat).

First, we turn off any unnecessary "echoes" of our commands (old friend of all DOS batch scripters):

```batch
@echo off
```

Then we ping the most reliable server which we can find (I use Google, but that [might not be good idea](http://techcrunch.com/2009/05/14/googles-gets-its-own-fail-whale/)):

```batch
ping -n 1 www.google.com|find /i "Received = 1" > NUL
```

Note the "pipe" (`|`) operator which pipes the output of the first command to the input of the second one. ping first sends a single ICMP packet to www.google.com. `find` command then searches the output of ping for "Received = 1" string, and compares the result. For IFTHEN clause we will be using a check of the ErrorLevel, which gets raised if an error has occurred:

```batch
if not ErrorLevel 1 (goto :WORKS) else (goto :DOESNTWORK)
```

`goto` commands use labels to redirect the flow of the script. So if no error was raised during the last compare (e.g. ICMP packet was successfully returned), script will execute all code under the :WORKS label:

```batch
eventcreate /l System /t INFORMATION /so internet-checker /id 200 /d "Internet OK, proceeding normally..."
goto end
```

Here we will log the check as successful to the Windows Event Log, in order to keep track when the check has occurred. `eventcreate` command helps us achieve that, by logging our event to the System log, as a type of Information, with an ID of 200 (any ID from 1 through 1000 will do).

In case there was a problem with a `ping` packet, and error was raised, code under the second label would be executed:

```batch
:DOESNTWORK
eventcreate /l System /t ERROR /so internet-checker /id 500 /d "Internet down, rebooting router..."

:: START CURL EXECUTION

:: FOR WEBSTAR CABLE MODEM
:: curl -d "ResetToFactory=3" -d "RestoreFactoryYes=1" http://192.168.100.1/goform/reset

:: FOR TPLINK CABLE ROUTER
:: curl -D - -s -u "user:pass" "http://192.168.1.1/userRpm/SysRebootRpm.htm?Reboot=Reboot"

:: FOR TPLINK ADSL ROUTER
curl -D - -s -u "user:pass" "http://192.168.0.3/rebootinfo.cgi"

:: END CURL EXECUTION
```

First, we log an Event, but a different one, of type Error, and with an ID of 500. Then we turn to the curl program and execute a request which will result in router reboot. As you can see there are numerous options for this, and these are just some cases I stumbled upon. I’d liked to keep them all in case I would need to refactor this script for a different use (I will just uncomment them by removing `::`). Take a closer look at the last curl command: switch `-u` sends a "user:pass" combination, because `curl` must be able to make proper HTTP authorization in order to use the script.

There are some caveats in this whole DOS batch approach:

* storing user/pass combination plain like this in a text script is a little bit sensitive, but it beats the hell out of need to manually enter the password when prompted (not a particularly efficient for an automated solution).
* `eventcreate` command produces an output which confirms that an event was logged, and this is difficult to avoid (there is no `/quiet` switch here).
* also, a brief command prompt window would appear if the program was called from GUI.

So, how to address these issues? Well, there is a small program which can "compile" your DOS batch script to an .EXE file, with a few added bonuses. The program name is [Bat To Exe Converter](http://www.f2ko.de/programs.php?lang=en&pid=b2e) and it’s freeware.

Compiled programs are difficult to decompose, so user/pass combination for your router will probably be safe. There is also an option to encrypt the .EXE file, which is even safer. Then, there is an option to make the new application "invisible", e.g. there would be no pop up window, no output, nothing! That’s 3 of 3.

![Bat To Exe Converter](https://cdn.dvuckovic.com/posts/internet-checker-bat2exe.jpg#nozoom)

Now let’s go over bonuses:

* there is an option to include all external programs and extract them on runtime, along with deleting the files when done with them (here you can include curl and its DLLs.
* you can add an icon to the .EXE file and make all thing much more serious :)
* programs allows you to embed .EXE manifest, too

I was sold when I tried all this, and a final .EXE file was made. I will not be sharing it, because of the obvious reasons (I doubt someone else has this same user/pass combination on their router, on the same address nevertheless). So feel free to adapt the .BAT script and compile it.

In order to schedule the task for repetitive invocation, you can use following command:

```batch
C:\>schtasks /create /sc minute /mo 30 /tn internet-checker /tr "c:\internet-checker.exe"
```

It will create a task that runs our app on every 30 minutes (be sure to supply correct path!). Too much, too little? Adjust where necessary.

That’s it! Just be sure to check Event Log now and then to be sure you’re running the script (`eventvwr` opens up dedicated MMC window).

![Bat To Exe Converter](https://cdn.dvuckovic.com/posts/internet-checker-dos.jpg#nozoom)
