---
title: Setup S/MIME Encryption for Gmail
image: https://cdn.dvuckovic.com/posts/smime-certificates.jpg
summary: We got nothing to hide, but why not?
date: 2020-12-22
sticky: true
weight: 7
tags:
  - post
  - encryption
  - gmail
  - thunderbird
readingTime: 15 minutes
---

_UPDATE: For a guide on PGP encryption for Gmail, checkout [a separate post here](setup-pgp-encryption-gmail.md)._

It’s a sad truth that not one of the big email providers like _Gmail_ support the _S/MIME encryption_ in their products on a free plan. For a technology that dates back to 1990s, it’s almost trivial to implement it, but it looks like they decided to target mostly enterprise with this and similar security features.

Which is probably non-sense: the corporate world would almost certainly have this up & running on their own, as security is not something you would like to off-load to third parties.

## Shoddy Industry Practice

Another unfortunate thing is that most of the certificate authorities out there have stopped with issuing free S/MIME certificates. At one point, all of the bigger names in the industry had a free plan which, while limited to a year or so, was still a viable option for many.

At the end of year 2020, things are quite bad: _Comodo_ was the last big name [to stop issuing free certificates](https://secure.nurd.com/products/purchase.php?area=SecureEmailCertificate) at some point, and _Actalis_ has [an awful practice](https://extrassl.actalis.it/portal/uapub/freemail) of not allowing you to generate and keep a private key on your side.

The thing is, unless you really need for a third party to identify your identity, you can still benefit from signing/encrypting emails on your own. You can be your own certificate authority ;)

## Checklist

Well, the good news is that if you want to implement an S/MIME encryption workflow you are probably already good to go! All that you would need is:

* Access to _Gmail_ or a similar email service
* Relatively recent _OpenSSL_ installation
* Some secure backup storage for sensitive data
* _Thunderbird_ or a similar email client

## OpenSSL Setup

First, you need up & running _OpenSSL_ setup. You are most likely to already have it installed, you can verify with the following console command:

```sh
$ openssl version
LibreSSL 2.8.3
```

In this case, command was run on a recent _macOS_ system, and you can see that it’s using a _LibreSSL_ variant.

Using _OpenSSL_ can be very daunting, but one way to simplify it is to prepare a configuration file that you will use for most of the actions that require many options to be defined.

To do this for S/MIME certificate generation, simply put the following in a file called `smime.conf` in a folder of your choice:

```ini
[req]
distinguished_name = req_distinguished_name

[req_distinguished_name]
countryName = Country Name (2 letter code)
countryName_default =
countryName_min = 2
countryName_max = 2
stateOrProvinceName = State or Province Name (full name)
stateOrProvinceName_default =
localityName = Locality Name (eg, city)
localityName_default =
0.organizationName = Organization Name (eg, company)
0.organizationName_default =
organizationalUnitName = Organizational Unit Name (eg, section)
organizationalUnitName_default =
commonName = Common Name (e.g. server FQDN or YOUR name)
commonName_default =
commonName_max = 64
emailAddress = Email Address
emailAddress_default =
emailAddress_max = 40

[smime]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
subjectAltName = email:copy
extendedKeyUsage = emailProtection
```

Note that each of the fields can have a `*_default` value set, so whatever you put in there will be used out of box (however you can change it at the time of invocation).

With config file in place, you can set an environment variable that points to it, so it will be used for remainder of your console session:

```sh
export OPENSSL_CONF=/path/to/smime.conf
```

## Generate Certificate Authority

_NOTE: You will need a separate CA for *each* self-signed certificate you create! I learned this the hard way, and it could be a bug in Thunderbird or something, but by sticking to this rule, you will probably have fewer issues down the line._

First, generate a private key just for the purpose of your own certificate authority:

```sh
openssl genrsa -aes256 -out ca.key 4096
```

Provide a strong passphrase when asked, it will be used to secure your private key.

```
Generating RSA private key, 4096 bit long modulus
........................................................................................................................................................++
...........................................................................................................................++
e is 65537 (0x10001)
Enter pass phrase for ca.key:
Verifying - Enter pass phrase for ca.key:
```

Next, generate a self-signed certificate for the certificate authority:

```sh
openssl req -new -x509 -days 3650 -key ca.key -out ca.crt
```

You can choose which certificate fields you want to set, but keep in mind that _Common Name_ (`commonName`) should be set to something senseful, like **My Certificate Authority**. Additionally, please keep the _Email Address_ (`emailAddress`) empty (in case there is a default value, you can blank it by putting a dot `.` when prompted).

```
Enter pass phrase for ca.key:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) []:GB
State or Province Name (full name) []:Berkshire
Locality Name (eg, city) []:Reading
Organization Name (eg, company) []:
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:My Certificate Authority
Email Address []:
```

## Generate S/MIME Certificate

Finally, we are ready to generate personal S/MIME certificate. We start by generating another private key for it:

```sh
openssl genrsa -aes256 -out smime.key 4096
```

Provide a strong passphrase when asked, it will be used to secure your private key.

```
Generating RSA private key, 4096 bit long modulus
......................................................................++
......................++
e is 65537 (0x10001)
Enter pass phrase for smime.key:
Verifying - Enter pass phrase for smime.key:
```

Next, we can create a certificate signing request:

```
openssl req -new -key smime.key -out smime.csr
```

You can choose which certificate fields you want to set, but keep in mind that _Common Name_ (`commonName`) should be set to something senseful, like your full name. Additionally, please enter your account’s email address in the _Email Address_ (`emailAddress`) field.

```
Enter pass phrase for smime.key:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) []:GB
State or Province Name (full name) []:Berkshire
Locality Name (eg, city) []:Reading
Organization Name (eg, company) []:
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:John Doe
Email Address []:jdoe@example.com
```

Then, we can sign the certificate using the certificate authority we created in the previous step:

```sh
openssl x509 -req -days 3650 -in smime.csr -CA ca.crt -CAkey ca.key -out smime.crt -set_serial 1 -addtrust emailProtection -addreject clientAuth -addreject serverAuth -trustout
```

In this case, we will create a certificate valid for _10_ years (_3650_ days), but you can change this value at this time.

```
Signature ok
subject=/C=GB/ST=Berkshire/L=Reading/CN=John Doe/emailAddress=jdoe@example.com
Getting CA Private Key
Enter pass phrase for ca.key:
```

Finally, we can package the certificate into the widely recognized PKCS12 format:

```sh
openssl pkcs12 -export -in smime.crt -inkey smime.key -out smime.p12
```

You will need to armor the certificate export with an additional passphrase, since it will contain the private key as well.

```
Enter pass phrase for smime.key:
Enter Export Password:
Verifying - Enter Export Password:
```

## Thunderbird Setup

This guide assumes you already have your _Gmail_ account setup in _Thunderbird_. It can be either via _IMAP_ or _POP3_ protocol, it doesn’t really matter. In case you are having trouble with this, check your settings in the _Gmail_ web interface, and make sure the desired protocol is enabled. You can then use the new account wizard in _Thunderbird_ for connecting your account and authenticating via _OAuth2_.

Once the account is setup, go to the **Tools > Account Settings** screen, and on **End-To-End Encryption** under your account click on the **Manage S/MIME Certificates** button:

![Account Settings](https://cdn.dvuckovic.com/posts/smime-account-settings.png#nozoom)

Next, click on the **Your Certificates** tab and then on the **Import** button:

![Import Certificate](https://cdn.dvuckovic.com/posts/smime-import-certificate.png#nozoom)

Point it to your PKCS12 file generated in the previous step (`smime.p12`) and click **Open**.

Then, you need to also import your certificate authority, by going to the **Authorities** tab and clicking on **Import** button below. Point to the previously generated `ca.crt` file and click **Open**. In the next dialog, you can adjust the trust of your certificate authority, by marking the checkbox **Trust this CA to identify email users.** and confirm with **OK**. Close the dialog with another **OK**, and you will be back in the **Account Settings** screen.

Finally, select your certificate in both signing and encryption fields by clicking **Select** next to each. Your certificate name should be easily identifiable via its **Common Name** field you set in one of the previous steps.

![Select Certificate](https://cdn.dvuckovic.com/posts/smime-select-certificate.png#nozoom)

That’s it! You are now ready for some encryption tests.

## Test Signing

Just fire off the write email button, and choose the **Digitally Sign This Message** option from the **Security** toolbar button. In case you don’t have the PGP mechanism set up, the **Encryption Technology** will default to **S/MIME** for you automatically.

![Signing Message](https://cdn.dvuckovic.com/posts/smime-message-signing.png#nozoom)

Make sure the email is being sent out from you email address. For signing messages, the recipient does not have to have their S/MIME certificate set up.

You can also just save a draft of the message, and check if it’s signed correctly without actually sending it. Look for a small sign badge in the upper right corner of the message preview, for a confirmation that signing was successful.

![Signed Message Badge](https://cdn.dvuckovic.com/posts/smime-message-signed.png#nozoom)

## Test Encryption

To properly test the encryption with the certificate you just generated, you will need access to a second email account. To encrypt for the first email address, you actually need to add that address to the recipients (not the sender!).

Similarly to the signing, you can write a message and activate **Require Encryption** option from the **Security** toolbar button.

![Encrypting Message](https://cdn.dvuckovic.com/posts/smime-message-encryption.png#nozoom)

Saving the message as a draft will do the encryption for you, and you can check for confirmation again in the message preview header, where a suitable encrypted badge will be shown.

![Encrypted Message Badge](https://cdn.dvuckovic.com/posts/smime-message-encrypted.png#nozoom)

## Test Signing & Encryption

Full test can be pulled off by combining both options (**Digitally Sign This Message** and **Require Encryption**), but you need to understand it will be impossible to test both the signature and encryption with the same certificate. They are mutually exclusive, since you will always be signing only messages from your, and only incoming messages will be encrypted.

However, in case you have access to another email account that has its own pair of certificates set up, you can at least simulate signed & encrypted conversation. In that case, messages will be marked with a combined badge in their preview header.

![Signed & Encrypted Message Badge](https://cdn.dvuckovic.com/posts/smime-message-signed-encrypted.png#nozoom)

## Conclusion

Although it's not available for the web interface, approach outlined above is a viable way to have an S/MIME encryption workflow integrated in _Gmail_ or other email services. Especially if seldomly used, in case of some sensitive correspondence.

With certificates packaged and ready, you can also use them on other systems, for example on _Android_ via a suitable app (warm recommendation for the [FairEmail](https://email.faircode.eu/) app, which supports S/MIME encryption, although as a premium feature).

<small>_Reference: [Create Self-Signed S/MIME Certificates](https://www.dalesandro.net/create-self-signed-smime-certificates/) by John Dalesandro_</small>
