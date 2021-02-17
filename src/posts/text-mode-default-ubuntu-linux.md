---
title: Text mode by default in Ubuntu Linux
image: https://cdn.dvuckovic.com/posts/ubuntu-start-screen_header.jpg
summary: Go command line from the start!
date: 2010-11-29
tags:
  - post
  - linux
  - shell
  - ubuntu
readingTime: 10 minutes
---

So, I needed an installation of Linux in order to try something development related. Recently I tried several major LiveCD distributions in order to see which one has evolved significantly, and I thought that Fedora and SuSE did a good job, but was not completely satisfied. Somehow I managed to miss Ubuntu in these tests, and by hearing some good things about it recently, I managed to grab some time and try it.

Ubuntu Linux comes in several varieties, and Desktop seemed to suit my needs. Bootable ISO also contains LiveCD version for trying it first, so after a quick test I installed it in a virtual machine. It is pretty elegant and easy to configure, but a little too much easy by my standards. A simple task such as changing a runlevel mode was deemed impossible to achieve in GUI, so I turned to console.

After a quick & dirty look at conf dirs, I figured out that all user runlevel modes (2-5) were the same, at least in configuration. A quick test with runlevel command in terminal returned runlevel `N 2` as a setting. But configuration in `/etc/rc2.d/` showed that gdm process was not supposed to be running in this runlevel (imagine my surprise to read this in a terminal application within Gnome Desktop :). Something was fishy about this, so I searched for help on the web.

It turns out that the runlevels were simply circumvented in Ubuntu Desktop editions, and something called Upstart was now responsible for start sequence. It seems simple enough, new folder with startup scripts and symbolic links to startup scripts. But it wasn’t obvious what to do in order to skip X on startup, and I simply didn’t want to try and experiment with a new runlevel app before learning more about it.

While searching for more I stumbled upon an interesting thread on Ubuntu forums, which pointed out an interesting option in grub bootloader: text mode. In order to try it, you will need a shell access (whether in GUI terminal application, or console - try _Ctrl+Alt+F1_). Login with a regular user if you need to, and enter following commands:

```bash
user@ubuntu:~$ cd /etc/default
user@ubuntu:~$ sudo nano grub
```

After entering root password (it should be the same as a first user you created during the Ubuntu installation), you will end up in nano editor editing grub configuration file. Simply comment the existing line that starts with `GRUB_CMDLINE_LINUX_DEFAULT=...` with a `#`, and add a new line below, like this:

```apacheconf
# GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
GRUB_CMDLINE_LINUX_DEFAULT="text"
```

Save the file with _Ctrl+O_ command, confirm with _Y_, and in shell type:

```bash
user@ubuntu:~$ sudo update-grub
```

Now you can reboot your computer, and enjoy in text-only mode by default. In order to start GUI, just type `startx` command.

Source: [Ubuntu Forums post](http://ubuntuforums.org/showthread.php?t=1305659&page=3)

![sudo nano grub](https://cdn.dvuckovic.com/posts/ubuntu-nano-grub.jpg#nozoom)
![grub text mode](https://cdn.dvuckovic.com/posts/ubuntu-text-mode.jpg#nozoom)
