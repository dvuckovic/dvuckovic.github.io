---
title: Solve reCAPTCHA in JDownloader by e-mail
image: https://cdn.dvuckovic.com/posts/recaptcha_header.jpg
summary: Automate CAPTCHA solving while you’re out & about!
date: 2011-10-26
tags:
  - post
  - shell
  - ubuntu
  - automation
readingTime: 15 minutes
---

[reCAPTCHA](http://www.google.com/recaptcha) is nowadays one of the safest way to perform a Turing test. Many file hosts have implemented it for their free users, so it’s becoming more and more of a problem when there is need to download multiple files from a single uploader (such as spanned file archives). As an occasional downloader, I don’t have need to purchase premium accounts and lift these restrictions, so I mainly use [JDownloader](http://www.jdownloader.org) with free accounts to download them.

JDownloader has built-in anti-captcha mechanism, but, of course, this does not work for reCAPTCHA. Simply, it is used on so many systems, that an eventual automatic solution would surely compromise many, many sites, and prompt an immediate tweaking of it’s algorithm. Heck, even this site uses reCAPTCHA for anonymous comments, so it’s not an option.

Evidently, this threat is recognized by a whole bunch of developers, and work on it is effectively undermined. I have seen several OCR attempts, but percentage of correct answers is below 20%, and is bound to go even lower every time the algorithm is tweaked.

That said, I needed a solution for a remote reCAPTCHA solving, since JD does not provide it. And natural answer was: e-mail. As an early Android user, I have a perk of Gmail push mail option, which results in almost-instantaneous notification on the phone. Add a nice e-mail client, and you can respond to a message very fast, which is essential for a few minutes window offered to solve a reCAPTCHA challenge.

_NOTE: The recipe below is for Linux only!!! I used an Ubuntu distribution. Theoretically, this could work on a Windows/Mac platform also, if appropriate substitute programs exist. However, due to specific personal needs, I didn’t look around and can not guarantee for it to work. It is too platform specific!_

## Method

Since I dug around earlier in JDownloader folders, I noticed that it saves all captcha images in the `JDownloader/captchas` folder. So, effectively if you need to know when a captcha image is presented to a user, simply monitor this folder for any new files. Then of course, you can grab it, send it yourself by e-mail, reply code, have a script read it and simulate typing it to appropriate text box. Easy?

Well, almost :) On Linux there are many packages which can provide help for each step of this method, but finding the right combination of them needed some work. Add bash scripting to the list, and it’s a handful. But let’s start.

### Prerequisites

First, note the username under which your X11 and JDownloader works (e.g. username).

Now note the JDownloader folder (e.g. `~/JDownloader`). I will assume that you have JDownloader up and running, and set to your needs. It is advisable to prolong the time limit on captcha window (Settings > AntiCaptcha > Countdown for CAPTCHA window). I set it to 300 seconds, but probably the captcha will be already stale by then. This simply gives you enough time to respond to challenge, by keeping the window for input open.

Next, create a folder to store scripts, a note it’s path (e.g. `~/scripts`).

Also, note your e-mail address where you would like to receive messages with captcha images (e.g. `you@gmail.com`), and be sure to setup a separate e-mail account for your computer to read (e.g. `computer@gmail.com`; Gmail is probably best option, because it provides *free* POP3 access).

Now, let’s install some packages:

```bash
username@ubuntu:~$ sudo apt-get install incron fetchmail procmail sendemail xdotool
```

* `incron` handles filesystem events and can fire off scripts based on them
* `fetchmail` & `procmail` handles receiving e-mail and acting upon it
* `sendemail`, well, it sends e-mail :)
* `xdotool` can simulate keypresses in X11

Then proceed to configure each of the programs and scripts needed.

### incron

`incron` is an "inotify cron" system. It consists of a daemon and a table manipulator. You can use it a similar way as the regular cron. The difference is that the inotify cron handles filesystem events rather than time periods. So, it can effectively be used to monitor a folder for changes, and fire off a script if anything is changed.

Now, let’s configure it so we can use it under a regular user:

```bash
username@ubuntu:~$ sudo nano /etc/incron.conf
```

Uncomment the line that starts with:

```apacheconf
# allowed_users = /etc/incron.allow
```

so it becomes:

```apacheconf
allowed_users = /etc/incron.allow
```

Next, edit the `/etc/incron.allow` file, and add your username to it (simply type a username and save file):

```bash
username@ubuntu:~$ sudo nano /etc/incron.allow
```

Now set up the incron table:

```bash
username@ubuntu:~$ incrontab -e
```

It will open up the table in nano editor, paste the following line:

```apacheconf
~/JDownloader/captchas IN_CREATE ~/scripts/fam.sh
```

This tells incron to monitor `~/JDownloader/captchas` folder for new files, and execute `~/scripts/fam.sh` script accordingly.

### fam.sh

This script will have responsibility to check for new files and send them to your e-mail. It’s a simple bash script, copy paste it in a new file from the box below. Be sure to save it to `~/scripts` folder.

```bash
#!/bin/bash

# Change these variables to correct paths
MONITOR_DIR=~/JDownloader/captchas
TMP_DIR=~/JDownloader/sent_captchas
SUCCESS_DIR=~/JDownloader/sent_captchas/success
FILE_EXT=jpg

# Go to captcha directory
cd $MONITOR_DIR

# List all files with JPG extension
COUNT_FILES=$(ls -l *.$FILE_EXT 2> /dev/null | grep ^- | wc -l)

# If there are files like those, continue
if [ $COUNT_FILES -gt 0 ]; then

  # Loop all JPG files and move them to the temporary directory
  for f in *.$FILE_EXT; do
    mv $f $TMP_DIR
  done

  # Go to temporary directory
  cd $TMP_DIR

  # Loop all files there again
  for f in *.$FILE_EXT; do

    # Send each file in a separate email as an attachment
    sendEmail -f computer@gmail.com -t you@gmail.com -u "[CAPTCHA] Please solve" -m `date` -a $f -s smtp.gmail.com:25 -xu computer@gmail.com -xp password -q 

    # Move each file sent to success directory
    mv -f $f $SUCCESS_DIR
  done

fi
```

Tweak the variables near the top to your needs, and take a look at the line with sendEmail command: you will need to change your and your computer’s e-mail addresses, and also supply SMTP password for your computer’s e-mail account. If you are using e-mail by another provider, be sure to tweak the SMTP server’s address and port.

Now you have the functionality of computer sending you automated e-mails with captchas attached. Congratulations, now let’s continue.

### fetchmail & procmail

These two programs handle mail receiving on a system, with `fetchmail` logging and checking mail and `procmail` executing appropriate scripts. First, let’s configure `fetchmail`. It depends on a RC file in your user home directory, so let’s create it:

```bash
username@ubuntu:~$ nano ~/.fetchmailrc
```

In it we will define some options:

```apacheconf
set daemon 5;
set syslog;
set postmaster root;

poll pop.gmail.com with proto pop3 and options no dns
user "computer@gmail.com" there has password "password" is username here options ssl
```

We will run `fetchmail` as a service (daemon mode) with polling of 5 sec interval. Be sure to change computer’s e-mail address, password and your username on the system, so fetchmail will know where to store your email.

To start `fetchmail`, simply type `fetchmail` at shell prompt. New messages should immediately be received and stored to `/var/mail/username` file. In order to start `fetchmail` service as a current at every login, I added the autostart job in GUI, at System > Preferences > Startup Applications. You can do that, or simply create `fetchmail.desktop` at `~/.config/autostart` folder:

```apacheconf
[Desktop Entry]
Type=Application
Exec=fetchmail
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Name[en_US]=Fetchmail
Name=Fetchmail
Comment[en_US]=Start Fetchmail in deamon mode for current user
Comment=Start Fetchmail in deamon mode for current user
```

Next up is `procmail`. Similarly, first create the config file:

```bash
username@ubuntu:~$ nano ~/.procmailrc
```

And edit it to following:

```apacheconf
LOGFILE=/var/log/procmail.log

VERBOSE=YES
LOGABSTRACT=all

:0
* ^From: You <you@gmail.com>
* ^Subject:.*CAPTCHA
{
:0c:
${DEFAULT}
:0
|~/scripts/type.sh
}
```

This `procmail` recipe will scan incoming message, see if it has your **From** address, appropriate **Subject**, and execute `~/scripts/type.sh` script with the message at STDIN.

Now, let’s move to the final step.

### type.sh

This script will scan message from standard input for the FIRST line in its body, compare this to the last code it received (if any), and if it is new, it will simulate typing it to the active window in GUI (using xdotool).

```bash
#!/bin/bash

# Export X display variable (in order for script to have access to desktop)
export DISPLAY=:0

# Extract new code from STDIN using awk parser, head and
# tail commands for first line in the message body
NEW_CODE=$(cat /dev/stdin | awk '/Content-Type: text\/plain;/,G' | head -3 | tail -1)

# Extract old code from temp file
OLD_CODE=$(cat ~/scripts/old_code)

# If, and only if new code is different from the old code
# use xdotool to simulate typing it to active window
# and store new code in a temp file
if [ "$NEW_CODE" != "$OLD_CODE" ]
then
    xdotool getactivewindow type "$NEW_CODE"
    xdotool key Return
    echo "$NEW_CODE" > ~/scripts/old_code
fi
```

That does it! This script assumes that the active window in X11 is indeed CAPTCHA window in JD. If the computer is unattended (as is the premise), it will type the code from the e-mail to the box, and simulate pressing "Enter", after which the download should continue.

## Conclusion

In reality, this method works as intended... more or less :) Sometimes I can’t answer immediately, but after a few minutes, new message will appear with new captcha, and so on, until captcha limit is reached (depends on the host).

![Received CAPTCHA in Gmail](https://cdn.dvuckovic.com/posts/recaptcha-1_big.jpg#nozoom)

Of course, these bash scripts method could be refined (e.g. by scanning the files for specific hosts, a method to easily disable/enable monitoring from JD, etc), feel free to build upon it. But it does the job fairly consistent, and it beats the hell out of manually logging via VNC and checking if it is time for new captcha :)

![Sent solution in Gmail](https://cdn.dvuckovic.com/posts/recaptcha-2_big.jpg#nozoom)
