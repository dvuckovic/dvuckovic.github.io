---
title: Backup Gmail for free
image: https://cdn.dvuckovic.com/posts/gmail-backup_header.jpg
summary: Take back your data!
date: 2011-08-19
tags:
  - post
  - gmail
  - thunderbird
  - internet
readingTime: 15 minutes
---

Believe it or not, some people are already having trouble with free space on Gmail. Not me, I'm at 38% full at the moment, but those large attachments proved to be deadly for some. If you don't want to pay for the extra storage but want to keep all those old emails, read on for an effective offline backup using Mozilla Thunderbird client.

## Dreaded 'almost out of space' message

My friend got a message above when he approached 95% of allotted free storage on Gmail. Although it's unbelievable that someone could use all of 8GB allowance, and that only yesterday we were opening accounts (2005!) and joked about how we were never going to fill it up, six years is no small period of time and some convenient options of Gmail (such as NOT deleting a single message or enormous attachments) attributed to accelerated exhaustion of space.

Of course, you could just start deleting old messages, or pay for more storage using some storage plans at disposal, but what if we could first backup everything to local client, and then start to free up some space online?

## Thunderbird

I tried many different approaches over the years in order to have a working offline copy of my Gmail inbox (most notably Google Gears and Offline mode in Gmail), but there were some serious issues, like not being able to move the backup across different platforms and computers, complicated procedure and limited number of messages cached locally.

But the most logical method, using a dedicated mail client and downloading messages using some popular mail protocol, was before my eyes all those years! Gmail was one of the first of free webmail providers to enable POP3/IMAP access to mail for free.

Quick summary:

* IMAP is great for mobile devices and every other client who needs to have a quick look at the cloud copy
* POP3 is meant for traditional mail clients and local offline copy

### So, POP it is!

First, be sure to understand some pros and cons of using POP method to backup Gmail.

Pros:

* Offline baby! You can ZIP it, store it, retrieve it, even when Gmail or your internet is down
* Search! Modern Thunderbird client has robust and reliable search indexing

Cons:

* Labels are gone! You can reapply Tags, or organize mails in Folders, but, sadly, it's not automatic
* Everything is in a single folder (mashed Received and Sent mails in Inbox), unless you make it different (manually)

If you're alright with this, then proceed with setup.

### Setup

Login to your Gmail account and go to **Mail Settings** underneath the gear icon in upper right corner. Choose **Enable POP for all mail** and leave **keep Gmail's copy in the Inbox** selected.

![Gmail POP settings](https://cdn.dvuckovic.com/posts/gmail-backup-00.jpg#nozoom)

Now download and install latest [Thunderbird](http://www.mozilla.org/thunderbird/) client and start it.

At the first screen, enter **your name** and **email address** in appropriate fields (leave the **password** field blank for now), and click **Continue**.

![Thunderbird Mail Account Setup](https://cdn.dvuckovic.com/posts/gmail-backup-01.jpg#nozoom)

Thunderbird will query it's database on appropriate server names, and present you with the following option. Choose **POP3** method and click **Create Account**.

![Thunderbird Mail Account Setup](https://cdn.dvuckovic.com/posts/gmail-backup-02.jpg#nozoom)

When Thunderbird prompts you once again about your password, click **Cancel** for now. We need to set some options first.

![Skip Enter your password](https://cdn.dvuckovic.com/posts/gmail-backup-03.jpg#nozoom)

Now go to menu **Tools > Account Settings**...

![Thunderbird Tools > Account Settings...](https://cdn.dvuckovic.com/posts/gmail-backup-04.jpg#nozoom)

Go to **Server Settings** below your account name, and for **Check for new messages every** enter 1 minute, and decheck two options below **Leave messages on server** (leaving it selected).

![Thunderbird Account Settings](https://cdn.dvuckovic.com/posts/gmail-backup-05.jpg#nozoom)

Confirm changes and when asked once again about your password, enter it, and check **Use Password Manager to remember this password**.

![Thunderbird Account Settings](https://cdn.dvuckovic.com/posts/gmail-backup-06.jpg#nozoom)

That's it! Your mail should be arriving now, probably by couple hundred messages a time, but this will fall down to several as time goes by. This method can last for one or two weeks for giant mailbox, but be patient and be sure to run Thunderbird in background (do not close it until you have all your messages downloaded locally).

By using settings above, we made sure that all messages will stay on cloud storage during all this process and that any subsequent backups will start from beginning of time :) You never know if something can go badly, so be sure to have all your messages on your computer (and several backups, mind you), before you start deleting messages online and freeing that precious space.

Backup of Thunderbird's profile is relatively easy (if you know where to look), but this convenient app ([MozBackup](http://mozbackup.jasnapaka.com/)) should help a bit, so be sure to check it out.

<small>_Thanks to [Vladimir Nenezic](http://www.vlajkoshjk.com) for screenshot!_</small>
