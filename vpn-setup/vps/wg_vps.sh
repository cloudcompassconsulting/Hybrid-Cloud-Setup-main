#!/bin/bash

# Install WireGuard
wget https://git.io/wireguard -O wireguard-install.sh
bash wireguard-install.sh

# store the default the network interface name
NETWORK_INTERFACE=$(ip route get 1.1.1.1 | awk '{print $5}')
PRIVATE_IP=$(ip -o -f inet addr show dev $INTERFACE | awk -F '[ /]+' '/inet / {print $4}')
SUBNET=$(ip -o -f inet addr show dev wg0 | awk '{print $4}')

# Ask the user for the client IP address
read -p "Enter the client IP address: " CLIENT_IP

# Enable IP forwarding and MASQUERADE
sysctl -w net.ipv4.ip_forward=1
sysctl -p
iptables -t nat -A POSTROUTING -s $SUBNET -o $INTERFACE -j MASQUERADE


# set iptables nat table and set default policies
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT


# Add iptables rules for ports 22, 80, and 443
iptables -A INPUT -p tcp -m tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 443 -j ACCEPT

# Define the ports you want to forward
PORTS="80,443"

# Forward and masquerade all traffic from ports 80, and 443 to the client
iptables -A FORWARD -i wg0 -o $NETWORK_INTERFACE -p tcp -m multiport --dports $PORTS -d $CLIENT_IP -j ACCEPT
#iptables -A FORWARD -i wg0 -o eth0 -p tcp -m multiport --dports "80,443" -d 10.7.0.2 -j ACCEPT

iptables -t nat -A POSTROUTING -o $NETWORK_INTERFACE -p tcp -m multiport --dports $PORTS -d $CLIENT_IP -j MASQUERADE

# Add the PostUp and PostDown commands to the WireGuard configuration file
echo "PostUp = iptables -t nat -A PREROUTING -p tcp -i $NETWORK_INTERFACE --match multiport --dports $PORTS -j DNAT --to-destination $CLIENT_IP" >> /etc/wireguard/wg0.conf
echo "PostUp = iptables -t nat -A POSTROUTING -o $NETWORK_INTERFACE -j SNAT --to-source $PRIVATE_IP" >> /etc/wireguard/wg0.conf
echo "PostDown = iptables -t nat -D PREROUTING -p tcp -i $NETWORK_INTERFACE --match multiport --dports $PORTS -j DNAT --to-destination $CLIENT_IP" >> /etc/wireguard/wg0.conf
echo "PostDown = iptables -t nat -D POSTROUTING -o $NETWORK_INTERFACE -j SNAT --to-source $PRIVATE_IP" >> /etc/wireguard/wg0.conf

# Make sure the rules persist across reboots
sudo apt-get install -y iptables-persistent

# Restart WireGuard for changes to take effect
sudo systemctl enable --now wg-quick@wg0
wg-quick up wg0
wg-quick down wg0 && wg-quick up wg0
