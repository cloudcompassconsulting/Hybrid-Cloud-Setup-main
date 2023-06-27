#!/bin/bash

# Install WireGuard
wget https://git.io/wireguard -O wireguard-install.sh
bash wireguard-install.sh

# store the default the network interface name
NETWORK_INTERFACE=$(ip -4 route | awk '/default/ {print $5}' | head -n 1)

# code not working so hardcoded in this example
#PRIVATE_IP=$(ip -4 addr show $IFACE | awk '/inet/ {print $2}' | cut -d'/' -f1)
PRIVATE_IP="172.26.14.128"

# Ask the user for the client IP address
read -p "Enter the client IP address: " CLIENT_IP

# Enable IP forwarding
echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
sysctl -p

# Flush iptables nat table and set default policies
iptables -t nat -F
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT

# Add iptables rules to open ports 25, 80, 443, 22, and 51820
iptables -A INPUT -p tcp -m tcp --dport 25 -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 51820 -j ACCEPT

# Forward and masquerade all traffic from ports 25, 80, and 443 to the client
iptables -A FORWARD -i wg0 -o $NETWORK_INTERFACE -p tcp -m multiport --dports 25,80,443 -d $CLIENT_IP -j ACCEPT
iptables -t nat -A POSTROUTING -o $NETWORK_INTERFACE -p tcp -m multiport --dports 25,80,443 -d $CLIENT_IP -j MASQUERADE

# Define the ports you want to forward
PORTS="25,80,443"

# Add the PostUp and PostDown commands to the WireGuard configuration file
echo "PostUp = iptables -t nat -A PREROUTING -p tcp -i $NETWORK_INTERFACE --match multiport --dports $PORTS -j DNAT --to-destination $CLIENT_IP" >> /etc/wireguard/wg0.conf
echo "PostUp = iptables -t nat -A POSTROUTING -o $NETWORK_INTERFACE -j SNAT --to-source $PRIVATE_IP" >> /etc/wireguard/wg0.conf
echo "PostDown = iptables -t nat -D PREROUTING -p tcp -i $NETWORK_INTERFACE --match multiport --dports $PORTS -j DNAT --to-destination $CLIENT_IP" >> /etc/wireguard/wg0.conf
echo "PostDown = iptables -t nat -D POSTROUTING -o $NETWORK_INTERFACE -j SNAT --to-source $PRIVATE_IP" >> /etc/wireguard/wg0.conf

# Restart WireGuard for changes to take effect
wg-quick down wg0 && wg-quick up wg0

# Save the iptables rules
iptables-save > /etc/iptables.up.rules

# Create a script that will load the iptables rules on boot
echo "#!/bin/sh" > /etc/network/if-pre-up.d/iptables
echo "/sbin/iptables-restore < /etc/iptables.up.rules" >> /etc/network/if-pre-up.d/iptables
chmod +x /etc/network/if-pre-up.d/iptables
