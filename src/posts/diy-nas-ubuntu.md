---
title: A DIY NAS with Ubuntu
image: https://cdn.dvuckovic.com/posts/ubuntu-nas_header.jpg
summary: Personal experience with a NAS box based on Linux
date: 2010-12-24
tags:
  - post
  - diy
  - hardware
  - linux
  - ubuntu
readingTime: 30 minutes
---

As a personal collection of large files grows, one has always problems with additional storage. Once the problem was with not enough disk space, but today it may as well be the physical space to store the disks. A computer case is only as big, and soon you can’t add new disks, because there is simply no room in it. This is a problem I first faced a couple of years ago, and pondered ever since to solve it.

## First approach (data tank)

At first I tried physically moving the disks in a new case, with separate power supply, and connecting it via eSATA interfaces to the main computer. Aside from a simple hack in order to turn on the power supply and disks without a dedicated motherboard, it worked pretty well. Speed was top-notch, because disks were plugged over PCI-E SATA2 controllers, and they were pretty much considered part of the machine.

But, there was a major drawback: data was locked to the computer the data tank was attached to, and I simply wasn’t able to make the power management work with Windows OS. Disk’s were spun up all at once for the remainder of the session, and I had to manually spin them down in order to turn them off. Very complicated procedure and takes a lot of time.

## Contemplating hardware

Since I bought a cheap BTX case, I couldn’t just put a computer in it, well because it was a BTX case ;) I had an old AMD Duron based MB in storage, and was thinking of putting it in a good use. Luckily enough, it turns out BTX power supply was compatible with the old ATX board, save for one shaved off plastic hook. So, I had disks and PSU, and needed to acquire only:

* a roomy ATX tower (turns out [CoolerMaster Elite 335 w/o PSU](http://www.coolermaster.com/product.php?product_id=5239&category_id=3586) was a bargain, with plenty of space in 3.5" and 5.25" slots)

* 2 additional [PCI SATA controllers with 2 ports each](http://www.siliconimage.com/products/product.aspx?pid=63) (because old Duron MB didn’t have any)

It was a cheap "upgrade", well below 100€ mark, and I was really happy about reviving an old computer which was starting to pick up dust.

![Closeup of 5 1TB Samsung drives](https://cdn.dvuckovic.com/posts/_MG_2038.jpg)

## Software

There is a plenty of options for a NAS server these days ([FreeNAS](http://freenas.org/) being on of them), mostly based on customized Linux distributions. But I was puzzled that not a single one of them provided a GUI mode out-of-box (no X server, no Windows manager, only console mode). This was remedied mostly with Web interfaces for each service, but what if one wanted to run a program that runs only in GUI mode? There are many examples of programs running only in GUI mode ([JDownloader](http://jdownloader.org/) being one of them).

Since there is abundance of stable and reliable Linux distributions out there, I started to think if I would be able to configure one to suit my needs as a NAS. [Ubuntu](http://www.ubuntu.com/) was a logical choice (Desktop Edition), since it has a massive support base, and countless boards dedicated to it.

I didn’t wanted to reformat disks I have already filled to the brim, so they should be left as NTFS. I remembered that Linux had some problems with Microsoft’s filesystem in the past (e.g. read-only access), but was pleased to read that Ubuntu 10.10 comes with NTFS-3G installed. It is not as speedy as it could be under Windows, but it’s close, and speed won’t be an issue since I plan to hook this thing to a 100Mbit home router. And also, I had a guarantee that if the experiment with Linux collapsed, I could still access all data from a Windows box.

### Installing Ubuntu

Piece of cake, but a bitter one. I managed to install Ubuntu some 5 times, before I finally realized a problem I’ve been having with freeze on login: my old Matrox AGP card was not supported. Rather than try all driver possibilities (VESA, VGA, etc), I found an old GeForce2 AGP card in my collection, swapped it, and everything went without a hitch after this. Maybe it was my error that I didn’t fully read HCL for Ubuntu 10.10 before attempting it to install on a really old piece of hardware, but I was happy that I resolved the problem quickly.

I put the Ubuntu installation to a smaller 40 GB Maxtor Raptor 10k RPM disk, and added a 500 GB Seagate disk as a temp (for downloads, etc). My collection was, however, contained on 5 identical Samsung 1TB disks, so I needed as many SATA ports I could get. One 3114 PCI card (4 ports) and two 3112 PCI cards (2 ports) seemed enough, for this setup, at least.

### Setting up services

Ubuntu comes with a plethora of services preinstalled, but I did have somewhat special case. I wanted to have a headless server (w/o direct input), to fully support Windows home network (Samba) and a liberal power management (disks standby).

For a remote access, I enabled Remote Desktop in Ubuntu (vino based). It is accessed from System > Preferences > Remote Desktop menu. Vino runs on standard VNC port 5900, so it is probably good idea to forward it on the router. For VNC clients I would recommend TightVNC (Windows) and Chicken of the VNC (Mac).

SSH is always a good thing to have. To install it simply type following command in Terminal:

```bash
user@ubuntu:~$ sudo apt-get install openssh-server
```

`apt-get `is part of Advanced Packaging Tool (APT), popular packaging manager on Debian and its variants. OpenSSH implementation comes with a handy SFTP service, which is a lot like regular FTP, but is tunnelled over SSH and supports nice features such as remote copy and shell executions. SSH runs by default on port 22 (forwarded by router), and there are plenty of clients on all major OSs (putty on Windows, ssh on Mac/Linux).

Samba is a free implementation of Windows networking under Linux, and, for a difference, it works very well. Installation is simple:

```bash
user@ubuntu:~$ sudo apt-get install samba samba-common samba-common-bin
user@ubuntu:~$ sudo apt-get install system-config-samba
```

Second command installs a handy GUI configuration utility. To access it go to System > Administration > Samba, and you can set up shares there. I set up only one, because I intend to mount all my disks in sub-folders in it. Since Windows network works only in local, I enabled guest access, because I didn’t want to bother with entering user/pass on every single client.

### Managing disks

In order to auto-mount disks to predefined mount points under Linux, editing of fstab is encouraged. There are two approaches in order to determine which disk to mount, and the more recent and correct way is to use UUID of the disk partition, since their `/dev/sd[a-z]` designations might change when tampered with. To obtain the list of all UUIDs on the system, use the following command:

```bash
user@ubuntu:~$ sudo blkid
```

It will list all partitions and corresponding UUIDs. Copy the desired one, and then edit fstab:

```
user@ubuntu:~$ sudo nano /etc/fstab
```

Each disk partition should have its own line in the configuration file in order to auto-mount it:

```apacheconf
UUID=YOUR_UUID   /mount/point   <filesystem_type>   <options>   <dump>   <pass>
```

e.g.

```apacheconf
UUID=6C6445206444EE80   /home/duca/Shared/1   ntfs-3g   defaults   0   0
```

Power management for disks is a little more complicated. There is a utility called `hdparm` that manages this, but I was unsuccessful at first. Commands simply failed to spin down hard disks, and finally I found out the reason. Turns out newer hard disks (especially "Green" ones) have embedded APM, and in order to switch the control to the OS, they should be disabled. Luckily `hdparm` has this option, with a `-B` switch:

```bash
user@ubuntu:~$ sudo hdparm -B 255 /dev/sda
```

This will disable internal APM in the disk, and now you can spin down disk by using:

```bash
user@ubuntu:~$ sudo hdparm -y /dev/sda
```

In order to automate these settings you can edit `/etc/hdparm.conf` file and add following for each disk:

```apacheconf
/dev/sda {
    apm = 255
    poweron_standby = off
    keep_features_over_reset = on
}
```

Now that you can spin the disks down, you will want a manager that will monitor the disk activity and put them to stand by accordingly. I stumbled upon [spindown](http://code.google.com/p/spindown/) project that does this very good, and it only needs to be configured right in order to work. Spindown should be installed by following its installation instructions, but first make sure you have build essentials on your box:

```bash
user@ubuntu:~$ sudo apt-get install make g++ build-essential
```

Now you can download and build spindown:

```bash
user@ubuntu:~$ wget http://spindown.googlecode.com/files/spindown-0.4.0.tar.gz
user@ubuntu:~$ tar xvzf spindown-0.4.0.tar.gz
user@ubuntu:~$ cd spindown-0.4.0/
user@ubuntu:~$ make
user@ubuntu:~$ sudo make install
```

To configure spindown, first copy the sample configuration to `/etc`, then list your disks by ID and then edit the conf file:

```bash
user@ubuntu:~$ cp spindown.conf.example /etc/spindown.conf
user@ubuntu:~$ ls -l /dev/disk/by-id/
lrwxrwxrwx 1 root root  9 2010-12-22 08:37 ata-ST3500320AS_9QM0BGVG -> ../../sdb
user@ubuntu:~$ sudo nano /etc/spindown.conf
```

The list line contains the disk ID, and you should note it down in order to edit configuration. Each disk should have its own block in `.conf` file, following an example:

```apacheconf
[Disk 1]
id = ata-ST3500320AS_9QM0BGVG
spindown = 1
command = hdparm -y
```

For the idle interval global setting should be set (`idle-time`), and then each exception changed in appropriate disk block. I set my global `idle-time` to 900 seconds (15 minutes), and then prolonged it for temp disk to 1800 seconds (30 minutes).

You can always check the status of your disks by issuing:

```bash
user@ubuntu:~$ sudo service spindown status
 * spindown is running
name     watched     active       idle-time        spindown-time
sda            0          1               5                 3600
sdb            1          0           16547                 1800
sde            1          0           16735                  900
sdd            1          0           16735                  900
sdg            1          0           16735                  900
sdf            1          0           16734                  900
sdc            1          0           16735                  900
```

And to check if the disk has indeed been put to standby:

```
user@ubuntu:~$ sudo hdparm -C /dev/sdb
/dev/sdb:
 drive state is:  standby
```

### Conclusion

First, I was very impressed by the elegance of setting up a modern Linux box, chances are that if somebody already posted something that worked for them, it will work for you too. Of course, you can’t find everything you need in one place, but if you know what you are looking for, somebody probably have already figured it out.

Second, most things work out-of-box, as expected, in contrast to other OSs where every single thing is plagued with bugs. For the first time I have a fully working Windows network, ironically set up using Linux :D And stability of it is just amazing: it’s been now almost a month since I set up this box, and not a single restart was needed.

![System and Temp drives](https://cdn.dvuckovic.com/posts/_MG_2040.jpg)
