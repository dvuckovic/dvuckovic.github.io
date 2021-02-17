---
title: Problems with Wake on Wireless LAN
image: https://cdn.dvuckovic.com/posts/wake-on-lan_header.jpg
summary: Clever workaround for a completely wireless home
date: 2012-02-17
tags:
  - post
  - internet
  - hardware
  - network
readingTime: 10 minutes
---

One of the great little things about computers is surely Wake On Lan feature on most network cards. It allows you to wake up a turned off or sleeping computer by sending a remote wake up packet (sometimes called a 'magic' packet). I found myself depending on this nifty little thing lately, since I want to be able to access files remotely, but I don’t want to have a computer running all the time (it’s not very green, is it?) or be there physically to turn it on (beats the purpose, I guess).

But, what do you do if you find yourself in a situation where the computer you want to turn on has to be wireless connected? A small search later you can find out there indeed are wireless network cards that support Wake On Wireless LAN feature, but it’s not standardized or widely supported. I failed to find fair priced card/dongle for my desktop computer, which is located in the room across from the wireless router and hub of my network. Since the laying of a long ethernet cable was out of question, I wondered what other solutions were out there?

## WDS Bridge

Every wireless equipment manufacturer has a way of bridging their equipment. TP-Link has a feature called WDS Bridge, where you can connect two routers where one simply acts as a client and connects to the other one. Wireless radio feature is available along with the bridge, so you can effectively use the client router as a repeater for your WiFi network (if you name it the same as the host one and assign it same password).

Since the desktop computer now doesn’t need a wireless card (you can simply hook it up to the client WDS router using a short ethernet cable), wired network card comes into play along with all its features (including WOL). I tested it thoroughly and it works and behaves as expected.

Below is my new home network chart, for reference :)

![My Home Network chart](https://cdn.dvuckovic.com/posts/my-home-network.jpg)

## What about remote wake up?

This is where things start to get complicated. You see, WOL packet has to be sent to a broadcast address in the LAN, because turned off machines simply doesn’t have the assigned IP address. So packet (which consists of target network card MAC address) gets sent up to every terminal, usually on port 7 or 9. This is relatively easy to do inside the network (there is plethora of tools for all platforms, I even have an app on my smartphone), but if you want to send it from outside the network (let’s say over the internet), somehow router must be able to interpret it correctly and send it on broadcast address.

Sadly, most routers doesn’t have this option. They simply refuse to accept a port forwarding rule to forward the packet to broadcast address. Aside from modifying the firmware with an after-market one ([DD-WRT](http://www.dd-wrt.com/) for example), I don’t see a way to do this.

But there is workaround, fairly simple one. If you have a remote access to a machine that’s always active (let’s say a server with SSH), you’re good to go. Simply login to the machine and start a WOL client: it will work as a charm. I personally use a `wakeonlan` program in command shell under Ubuntu, but same goes for VNC or RDP shells.
