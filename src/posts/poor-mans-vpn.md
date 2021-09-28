---
title: Poor Man’s VPN
image: https://cdn.dvuckovic.com/posts/poor-mans-vpn_header.png
summary: Reliable server access to local networks behind CGNAT
date: 2021-09-20
sticky: true
weight: 1
tags:
  - post
  - linux
  - network
  - shell
readingTime: 30 minutes
---

IPv4 exhaustion is real, wake up sheeple!

Kidding aside, I was utterly surprised to find out that one of my ISPs recently resorted to selling out their assigned IPv4 ranges, probably due to high market prices. I was aware that they yanked static IP addresses for residential customers some time ago, but this was something I could still work around via the DDNS daemon. However, in case when not enough IPv4 addresses are available, they switched to Carrier-grade NAT (_CGNAT_) and ruined my day :'(

## What the hell is “CGNAT”?

From [Wikipedia]:

> Carrier-grade NAT (CGN or CGNAT), also known as large-scale NAT (LSN), is a type of Network address translation (NAT) for use in IPv4 network design. With CGNAT, end sites, in particular residential networks, are configured with private network addresses that are translated to public IPv4 addresses by middlebox network address translator devices embedded in the network operator's network, permitting the sharing of small pools of public addresses among many end sites. This shifts the NAT function and configuration thereof from the customer premises to the Internet service provider network (though "conventional" NAT on the customer premises will often be used additionally).

The end result is very simple: multiple households will share an external IP address when behind _CGNAT_, effectively rendering port forwards on home routers obsolete. Since newly installed ISP router is not configured to forward _any_ ports to its clients, this means that home networks cannot be reached from the outside any more. _Yikes!_

Obviously, as a big proponent of self-hosted services, I was devastated to find this out, especially since it was not communicated in a proper way: it just stopped working one day, without any explanation.

## VPN to the Rescue

_CGNAT_ rendered my self-hosted VPN server useless, since it could not be accessed any more. It was reachable only within the original network (let’s call it _LAN 2_).

Luckily, I had a spare VPN server in another network (let’s call it _LAN 1_). In this case, ISP **did** provide (and obviously charged) a static IP address, so it could be used normally.

I had to abandon the idea of a VPN server in _LAN 2_, but I was able to switch to a VPN client that would connect to _LAN 1_ via its VPN server. [OpenVPN] provides both server/client functionality, so it was easy to disable the server service and setup a client profile.

```shell
systemctl stop openvpn@<server>
systemctl disable openvpn@<server>
```

Where `<server>` is the name of the local VPN.

New client profiles can be copied to `/etc/openvpn/<vpn-name>.conf` and they are immediately usable. But, first some configuration changes were in order.

### Configuring VPN Client Profile

First, I decided to disable routing of all traffic across VPN tunnel, since this was not my use case. I wanted to access local services in _LAN 2_, not make them see and use everything from _LAN 1_. This can be disabled by commenting out the following line in the `conf` file:

```
# If redirect-gateway is enabled, the client will redirect it's
# default network gateway through the VPN.
# It means the VPN connection will firstly connect to the VPN Server
# and then to the internet.
# (Please refer to the manual of OpenVPN for more information.)

#redirect-gateway def1
```

To guarantee that the resultant VPN server in _LAN 1_ was not compromised in any way, it’s a good idea to force the checks of the server certificate by turning on another option:

```
remote-cert-tls server
```

Since I had set up the authentication on _LAN 1_ VPN server, I had to make this process automatic so the service can work in a headless environment. To do this, first I created a separate user on the VPN server, with its own, strong password. This information can be stored in a file with `/etc/openvpn/<vpn-name>.auth` which has the following structure:

```
<username>
<password>
```

The authentication file is then defined back in the `conf` file with following directives:

```
auth-user-pass <vpn-name>.auth
auth-nocache
```

### Making VPN Connection Persistent

If everything was set up correctly, now it should be possible to start the connection to _LAN 1_ via `systemd`:

```shell
systemctl start openvpn@<vpn-name>
```

At this point, connection can be tested by inspecting assigned IP address from the _LAN 1_ subnet on the OpenVPN interface, and by trying to reach some server from it. If it works, just make sure to enable the service so the connection can be persistent:

```shell
systemctl enable openvpn@<vpn-name>
```

I even tried to disconnect the client right on the server, it simply reconnected automagically some seconds later. _Cool!_

## Routing Requests

With two LANs bridged, we just need to make sure that all requests for _LAN 2_ server are properly routed, if initiated from _LAN 1_.

In case of the _LAN 1_ VPN server, it can easily resolve the _LAN 2_ server address without any trouble. However, this will not be the case to any PCs in _LAN 1_, for example.

Let’s say that the VPN subnet is in the `192.168.2.0` range, with `255.255.255.0` netmask, while the _LAN 1_ VPN server address is `192.168.1.101`. To set up a new route to the _LAN 2_ server, this command can be used on MacOS:

```shell
sudo route -n add -net 192.168.2.0/24 192.168.1.101
```

Note that this route will _NOT_ persist on MacOS, so we need to make it permanent with the following command as well:

```shell
sudo networksetup -setadditionalroutes <interface> 192.168.2.0 255.255.255.0 192.168.1.101
```

Where `<interface>` is the correct network interface name, e.g. `Ethernet`. You can get all network interface names with the following command:

```shell
networksetup -listallnetworkservices
```

The routes are easily set up on modern OSs, with notable exception for mobile devices, e.g. Android. Since it requires root permissions, we must think out of box and set up the route in a different way. I found that the easiest way would be to connect the mobile device to the same VPN network, and the routes are set up automatically. Note that in this case VPN must _NOT_ isolate its clients, allowing internal connections.

## Local Port Tunnelling via SSH

My first use case was trying to access a service in _LAN 2_ from _LAN 1_. Since the server in _LAN 2_ has an SSH service running, port tunnel was a natural choice.

First, you need to know the IP address of the target service, in my case it was a printer in _LAN 2_, let’s say with the `192.168.0.15` address. Next, we also need the target port number, which in my case was `631` (IPP).

On a server in _LAN 1_, a local port tunnel can be created with the following command:

```shell
$ ssh -o LogLevel=VERBOSE -N -L 6631:192.168.0.15:631 <user>@<server>
Authenticated to <server> ([<server>]:22).
```

Where:
* `-o LogLevel=VERBOSE` activates some logging, so you can be sure the tunnel is working
* `-N` switch means there will be no additional command execution, hiding the remote prompt
* `<user>@<server>` a valid SSH user for the server in _LAN 2_.

This command opens a port `6631` on `localhost` or `127.0.0.1`, which forwards to the target service on port `631`. Higher local port numbers are advised if you intend to run the command under normal user. Otherwise, you might need to prepend the command with `sudo`.

Or, in case you want the tunnel accessible by other machines in _LAN 1_, which do not necessarily have the route to _LAN 2_ (i.e. mobile devices), you can bind it to the interface IP, let’s say `192.168.1.18`:

```shell
$ ssh -o LogLevel=VERBOSE -N -L 192.168.1.18:6631:192.168.0.15:631 <user>@<server>
Authenticated to <server> ([<server>]:22).
```

In this case, the _LAN 2_ service will now be available in _LAN 1_ via `192.168.1.18:6631`, and any device in _LAN 1_ should be able to access it.

To close the tunnel, simply press _Ctrl+C_.

## Web Browsing

Second use case was trying to browse the Internet by using the external IP address of the _LAN 2_ (let’s call it _External IP 2_). This is possible via SOCKS proxy tunnel, which can also be created by utilizing the SSH service on the _LAN 2_ server.

First, we need to set up the system to use the SOCKS proxy on the local port, let’s say `1337`. On MacOS, this can be done via _Settings > Network > Advanced_ and then switching on the _SOCKS Proxy_ under _Proxies_ tab. Enter `localhost` for the server name, and `1337` for port.

![SOCKS Proxy](https://cdn.dvuckovic.com/posts/poor-mans-vpn-socks-proxy.png)

Then, to actually create the tunnel, simply open the connection to the server in _LAN 2_:

```shell
$ ssh -o LogLevel=VERBOSE -N -C -D 1337 <user>@<server>
Authenticated to <server> ([<server>]:22).
```

Afterwards, all web requests should just try to use the system settings for proxy, most probably this is already the case in your web browser if you didn’t modify its network settings. If you try to determine the external IP address, it should be _External IP 2_!

To further automate this, here is a short shell script to turn on the system proxy, activate the tunnel, and then wait for _Ctrl+C_ signal before terminating and restoring network settings. It might not work for you without setting up passwordless SSH access to _LAN 2_ server, but that’s out of the scope of this guide.

```shell
#!/bin/zsh

echo Turning on proxy...
echo

networksetup -setsocksfirewallproxystate <interface> on
networksetup -getsocksfirewallproxy <interface>

control_c() {
    echo
    echo Caught Ctrl+C, exiting cleanly...
    echo

    echo Turning off proxy...
    echo

    networksetup -setsocksfirewallproxystate <interface> off
    networksetup -getsocksfirewallproxy <interface>

    echo
    echo Done.

    exit 0
}

echo
echo Setting up Ctrl+C trap...
echo

trap control_c INT

echo Running proxy tunnel...

ssh -o LogLevel=VERBOSE -N -C -D 1337 <user>@<server>
```

Where `<interface>` is the correct network interface name, e.g. `Ethernet`, and `<user>@<server>` a valid SSH user for the server in _LAN 2_.

## Conclusion

I was able to successfully replicate most of the use cases for a VPN with this approach, but not everything was possible.

For example, I still don’t have an easy way for mobile devices to use the SOCKS proxy, because apparently that is not readily available in current Android?! But, other than that, most other services are usable with acceptable performance, even without direct access to the target network.

Hopefully, this guide helps you a bit if you are in a similar situation as me. _Good luck!_

[Wikipedia]: https://en.wikipedia.org/wiki/Carrier-grade_NAT
[OpenVPN]: https://openvpn.net/
