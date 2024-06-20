+++
title = 'Wireguard Setup (work notes)'
date = 2022-10-01T05:17:17+01:00
draft = false
tags = ['wireguard', 'vpn']
+++

Generate a valid and working WireGuard configuration file /etc/wireguard/wg0.conf. Our setup guide offers details.

Note: You may have to replace the Endpoint hostname with the WireGuard server IP address in the WireGuard configuration file. DNS may or may not be applied when systemd brings the wg0 interface up.
Add the WireGuard service to systemd:

```sh
sudo systemctl enable wg-quick@wg0.service
sudo systemctl daemon-reload
```

Start the new service immediately:

```sh
sudo systemctl start wg-quick@wg0
```

Reboot your computer system to verify the automatic connection on startup works as expected.

Check the service status:

```sh
systemctl status wg-quick@wg0
```

To remove the service and clean up the system:

```sh
sudo systemctl stop wg-quick@wg0
sudo systemctl disable wg-quick@wg0.service
sudo rm -i /etc/systemd/system/wg-quick@wg0*
sudo systemctl daemon-reload
sudo systemctl reset-failed
```

## Wireguard client

```sh
sudo apt install -y wireguard-tools resolvconf

# check /etc/resolv.conf
# edit /etc/wireguard/wg0.conf with dsired configuration

wg-quick up wg0
[#] ip link add wg0 type wireguard
[#] wg setconf wg0 /dev/fd/63
[#] ip -4 address add 10.1.1.2 dev wg0
[#] ip link set mtu 1420 up dev wg0
[#] resolvconf -a tun.wg0 -m 0 -x
[#] ip -4 route add 192.168.11.0/24 dev wg0
[#] ip -4 route add 172.16.55.0/24 dev wg0
 
sudo wg show

       
```
## Wireguard compose 

```yaml
wireguard:
    image: lscr.io/linuxserver/wireguard:latest
    container_name: wireguard
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/Madrid
      - SERVERURL= #optional
      - SERVERPORT=51820 #optional
      - PEERS=1 #optional
      - PEERDNS=auto #optional
      - INTERNAL_SUBNET=10.1.1.0 #optional
      - ALLOWEDIPS=0.0.0.0/0 #optional
      - LOG_CONFS=true #optional
    volumes:
      - /root/wireguard:/config
      - /lib/modules:/lib/modules
    ports:
      - 51820:51820/udp
    sysctls:
      - net.ipv4.conf.all.src_valid_mark=1
    restart: unless-stopped
```

## Configuration

```sh
scp root@agora:~/wireguard/peer1/peer1.png .

# Client configuration file
cat /config/peer1/peer1.conf
```
