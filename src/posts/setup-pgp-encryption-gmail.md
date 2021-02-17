---
title: Setup PGP Encryption for Gmail
image: https://cdn.dvuckovic.com/posts/pgp-thunderbird.jpg
summary: Generate an OpenPGP key entirely in GUI
date: 2020-12-23
tags:
  - post
  - encryption
  - gmail
  - thunderbird
readingTime: 15 minutes
---

While researching self-signed _S/MIME certificates_ for _Gmail_ in [a previous post](setup-smime-encryption-gmail.md), an idea came up to my mind to also try if PGP encryption would work in a similar way. Good news is: it’s even more easy to set it up in _Thunderbird_, considering you can do everything via GUI!

## Why is it not natively supported?

As _Gmail_ and other bigger free email providers mostly target enterprise with their encryption features, it was probably never an option to support a free standard such as _OpenPGP_. The issue probably lies in the lack of identity verification, which is almost non-existent for the PGP mechanism. It is actually assumed that you as the email account holder would generate both your public & secret key on your own, and there is never a third party service involved in the whole chain. (Unless you count the key server distribution as such a service, which you could argue for, but it’s not really the same thing.)

Since _Gmail and Co_ opted for the _S/MIME certificates_ as their encryption of choice, you will probably never see this natively supported. For sure, _S/MIME_ is normally a safer choice, but for personal correspondence it’s probably overkill. Additionally, some people are _stuck in the past_ so sometimes you have no other choice than to resort to PGP for encryption.

## Checklist

The process to generate your own _OpenPGP_ keys is pretty simple. All that you would need is:

* Access to _Gmail_ or a similar email service
* Recent version of the _Thunderbird_ email client
* Some secure backup storage for sensitive data

## OpenPGP Key Generation in Thunderbird

This guide assumes you already have your _Gmail_ account setup in _Thunderbird_. It can be either via _IMAP_ or _POP3_ protocol, it doesn’t really matter. In case you are having trouble with this, check your settings in the _Gmail_ web interface, and make sure the desired protocol is enabled. You can then use the new account wizard in _Thunderbird_ for connecting your account and authenticating via _OAuth2_.

Once the account is setup, go to the **Tools > Account Settings** screen, and on **End-To-End Encryption** under your account click on the **Add Key** button:

![Account Settings](https://cdn.dvuckovic.com/posts/pgp-account-settings.png#nozoom)

Next, make sure **Create a new OpenPGP Key** is selected, and click **Continue**:

![Add Key](https://cdn.dvuckovic.com/posts/pgp-add-key.png#nozoom)

Make sure correct **Identity** is selected (it should contain your name _and_ your email address). For **Key expiry** you can either chose an expiration date, or opt out for non-expiring key. Make sure to increase the **Key size** to _4096_ and then press **Continue**:

![Generate Key Settings](https://cdn.dvuckovic.com/posts/pgp-generate-key-settings.png#nozoom)

On the last screen of the wizard, just press **Confirm** and wait a bit. You can probably speed up the process by moving your mouse, scrolling around or performing some disk-intensive background operation, since it increases entropy.

![Generate Key Confirmation](https://cdn.dvuckovic.com/posts/pgp-generate-key-confirm.png#nozoom)

At the very end of the process, you will be back in the _Account Settings_ screen, and the new key should be pre-selected for your account.

As a last step, please take care to backup your keys for future use. First, backup your _secret_ key by going to the **OpenPGP Key Manager**, selecting your key in the list, and clicking on the **File > Backup Secret Key(s) To File**. You will need to choose a backup password and confirm it. Similarly, you can backup your _public_ key by clicking on **File > Export Public Key(s) To File**.

## Test Signing

Just fire off the write email button, and choose the **Digitally Sign This Message** option from the **Security** toolbar button. In case you don’t have the S/MIME mechanism set up, the **Encryption Technology** will default to **OpenPGP** for you automatically.

![Signing Message](https://cdn.dvuckovic.com/posts/smime-message-signing.png#nozoom)

Make sure the email is being sent out from you email address. For signing messages, the recipient does not have to have their PGP key set up.

You can also just save a draft of the message, and check if it’s signed correctly without actually sending it. Look for a small sign badge in the upper right corner of the message preview, for a confirmation that signing was successful.

![Signed Message Badge](https://cdn.dvuckovic.com/posts/pgp-message-signed.png#nozoom)

## Test Encryption

To properly test the encryption with the key you just generated, you will need access to a second email account. To encrypt for the first email address, you actually need to add that address to the recipients (not the sender!).

Similarly to the signing, you can write a message and activate **Require Encryption** option from the **Security** toolbar button.

![Encrypting Message](https://cdn.dvuckovic.com/posts/smime-message-encryption.png#nozoom)

Saving the message as a draft will do the encryption for you, and you can check for confirmation again in the message preview header, where a suitable encrypted badge will be shown.

![Encrypted Message Badge](https://cdn.dvuckovic.com/posts/pgp-message-encrypted.png#nozoom)

## Test Signing & Encryption

Full test can be pulled off by combining both options (**Digitally Sign This Message** and **Require Encryption**), but you need to understand it will be impossible to test both the signature and encryption with the same key. They are mutually exclusive, since you will always be signing only messages from your, and only incoming messages will be encrypted.

However, in case you have access to another email account that has its own pair of keys set up, you can at least simulate signed & encrypted conversation. In that case, messages will be marked with a combined badge in their preview header.

![Signed & Encrypted Message Badge](https://cdn.dvuckovic.com/posts/pgp-message-signed-encrypted.png#nozoom)

## Conclusion

Although it’s not available for the web interface, approach outlined above is a viable way to have a PGP encryption workflow integrated in _Gmail_ or other email services. Especially if seldomly used, in case of some sensitive correspondence.

With keys backed up, you can also use them on other systems, for example on _Android_ via a suitable app (warm recommendation for the [FairEmail](https://email.faircode.eu/) app, which supports PGP encryption, although as a premium feature).
