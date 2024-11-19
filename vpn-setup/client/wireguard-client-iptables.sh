#!/bin/bash

# Install WireGuard (Ubuntu/Debian example)
sudo apt update
sudo apt install -y wireguard

# Assuming the configuration file client.conf from the vps is in the current directory
# Move the configuration file to the right location
sudo mv client.conf /etc/wireguard/wg0.conf

# Enable and start the WireGuard service
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0

# Allow incoming connections to ports 80 (http) and 443 (https)
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# forward to the loadbalancer
sudo iptables -t nat -A PREROUTING -i wg0 -p tcp -m tcp --dport 80 -j DNAT --to-destination 192.168.8.60:80 #Note the IP address of the load balancer is set to 192.168.8.60 on the router as a static hosts
sudo iptables -t nat -A PREROUTING -i wg0 -p tcp -m tcp --dport 443 -j DNAT --to-destination 192.168.8.60:443

# Finally, enable IP forwarding
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Save the iptables rules
sudo iptables-save > /etc/iptables/rules.v4

# Make sure the rules persist across reboots
sudo apt-get install -y iptables-persistent


