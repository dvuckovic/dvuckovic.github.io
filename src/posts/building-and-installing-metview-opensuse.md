---
title: Building and installing Metview in openSUSE
image: https://cdn.dvuckovic.com/posts/metview_header.jpg
summary: A full build guide, incl. library dependencies
author: Dusan Vuckovic
date: 2013-03-09
tags:
  - post
  - linux
  - meteorology
  - shell
readingTime: 25 minutes
---

Recently I ventured to build and install a copy of Metview on a local computer, in order to provide my wife a testing platform when she is working from home. Metview is a meteorological workstation application and its capabilities include powerful data access, processing and visualization. It is maintained and developed in part by [ECMWF](https://software.ecmwf.int/wiki/display/METV/Metview).

ECMWF site does provide relatively precise instructions how to build software from sources, but I hit a wall at first try, mainly because instructions are a little vague at some points, and take many things for granted and obvious. This post should serve as a kind of mental note for future reference, but if somebody finds it useful, it’s fine by me :)

## Distribution

_UPDATE: Originally, this guide was written for openSUSE 11.3, but in the meantime I wondered if it would work on newer version (12.3). Short answer: it did, but with some modifications. I linked newer set of scripts [below](#12_3) for openSUSE 12.3, there are some additional packages needed, and I used this opportunity to install newer version of MetView too (4.3.7)_ :)

Installation guide lists openSUSE 11.3 and SLES 11 64bit as tested platform, so I didn’t want to experiment and went with [openSUSE 11.3 x86_64](http://ftp5.gwdg.de/pub/opensuse/discontinued/distribution/11.3/iso/). There is some benefit in testing older Linux distributions, since there has been some time people were using it. Online instructions are a plenty for openSUSE, and coming from Ubuntu/Debian background was rather easy. There are similar commands for almost all operations which differ between them, and once you learn proper paths for configuration files, you feel right at home.

I even managed to find an AutoYAST script online, which helped me to speed up installation by making it automatic. You just place the [configuration files](https://cdn.dvuckovic.com/downloads/autoyast.tar.gz) on a USB flash, and when you boot from installation DVD you just supply following Boot Options:

```
autoyast=device:///autoinst.xml
```

Setup will then search all devices for this configuration file, and luckily it will find one on your USB flash and proceed with automatic installation. Easy!

This script will create one user `metview` with password `metview` (which is also root password).

## Building libraries

Metview is dependent on some custom libraries, so you are advised to build these first. This are listed in preferred order of installation:

* [GRIB API](https://software.ecmwf.int/wiki/display/GRIB/What+is+GRIB-API) (I used v1.9.16)
* [EMOSLIB](https://software.ecmwf.int/wiki/display/EMOS/What+is+EMOSLIB) (I used v000382)
* [Magics++](https://software.ecmwf.int/wiki/pages/viewpage.action?pageId=14975084) (I used v2.18.12)

Before you can start compiling and installing everything, you first need some additional packages atop basic openSUSE installation. Please bear in mind that most commands need root privileges, so you might first want to go in superuser shell with `su` command.

For some reason, my basic installation didn’t include online software repositories, so I had to add it first:

```bash
zypper -n ar http://ftp5.gwdg.de/pub/opensuse/discontinued/distribution/11.3/repo/oss/ OSS
zypper -n --no-gpg-checks --gpg-auto-import-keys ar http://download.opensuse.org/repositories/Application:/Geo/openSUSE_11.3/ Geo
```

First one is official OSS repository, used for most of the packages. Second one is used for some additional binary packages needed for successful build process. They lack appropriate security key, that’s why there are some additional switches to override checks. There is also non interactive switch (`-n`) because my main goal is to make everything scriptable for automatic installation in the end :)

After you add repositories, you must refresh them and then install needed packages:

```bash
zypper -n --no-gpg-checks ref
zypper -n --no-gpg-checks in libnetcdf4 libnetcdf-devel libexpat-devel expat ghostscript-devel perl-Geo-Proj4 libproj-devel cairomm-devel cairomm-32bit perl-Cairo gd-devel jasper libjasper-devel gcc-fortran libqt4-devel openmotif openmotif-devel ImageMagick-devel ksh-devel libQtWebKit-devel nano
```

Next, we proceed with building GRIB API. First untar the archive and go to it’s directory:

```bash
tar zxvf grib_api-1.9.16.tar.gz
cd grib_api-1.9.16/
```

Instructions advise to use specific compiler flags on 64-bit systems (`-fPIC -O2`), so we will then call configuration script with them and default installation directory:

```bash
./configure CFLAGS="-fPIC -O2" --prefix=/usr/local
```

Finally, we build, check and install library:

```bash
make
make check
make install
```

If everything goes fine, there should not be any errors reported. Next on the list is EMOSLIB.

First, untar the archive:

```bash
tar zxvf emos_000382.tar.gz
cd emos_000382/
```

In order to build this properly, you first need to change aforementioned flags in configuration file. This wasn’t adequately explained in original instructions, so after little trial and error I finally made it. Easiest way to do this is to change configuration file from the command line, like this:

```bash
cp config/config.linuxR64 config/config.linuxR64.old
sed "s/CFLAGS  = -g/CFLAGS  = -fPIC -O2 -g/g" config/config.linuxR64 > config/config.linuxR64.new
mv config/config.linuxR64.new config/config.linuxR64
chmod 744 config/config.linuxR64
```

Next, I needed to change build script because I had to make sure the procedure is non-interactive. I just deleted all user interaction logic, and set variables to their default values. Script is included in the install script archive below, just copy it to `emos_000382/` folder and make sure it has executable permission.

Now, to the build and install process:

```bash
./build_library_R64
./install
```

Only one library remains and it’s the most complex one (Magics++). Proceed with following commands:

```bash
tar zxvf Magics-2.18.12.tar.gz
cd Magics-2.18.12/
./configure CFLAGS="-fPIC -O2" --prefix=/usr/local --enable-metview --enable-bufr
make
make check
make install
```

This will take most of the time needed for entire operation, some 30 minutes on a quad-core machine. In the end, you must set the environment variable for this library, and make sure it is included in all users bash environment:

```bash
echo -e "MAGPLUS_HOME=/usr/local\nexport MAGPLUS_HOME" > /etc/bash.bashrc.local
export MAGPLUS_HOME=/usr/local
```

## Building software

Finally, we can now build Metview software. I used v4.3.4 release which can be found on the [ECMWF software site](https://software.ecmwf.int/wiki/display/METV/Releases).

```bash
tar zxvf Metview-4.3.4.tar.gz
cd Metview-4.3.4/
./configure CFLAGS="-fPIC -O2" --prefix=/usr/local
make
make check
make install
```

If everything goes to plan, installation is complete. I made a shortcut link and it can be placed to desktop with following command:

```bash
cp MetView.desktop ~/Desktop/
```

## Automating installation

When I was content with installation procedure, I set to write a bash script for automatic installation which contains all the commands above. Installation script can be downloaded from [here](https://cdn.dvuckovic.com/downloads/install-metview-11.3.zip), the archive includes modified build script for EMOSLIB and desktop shortcut. To run it use following commands:

```bash
su
. ./install-metview.sh
```

Additional version of script suitable for openSUSE 12.3 and MetView 4.3.7 can be downloaded <a name="12_3" href="https://cdn.dvuckovic.com/downloads/install-metview-12.3.zip">here</a>.
