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

# Adjust firewall rules

# Flush existing rules and set default policy to DROP
#sudo iptables -F
#sudo iptables -P INPUT DROP
#sudo iptables -P FORWARD DROP
#sudo iptables -P OUTPUT ACCEPT

# Allow established and related incoming connections
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow incoming connections to ports 80 (http) and 443 (https)
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Finally, enable IP forwarding
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Save the iptables rules
sudo iptables-save | sudo tee /etc/iptables/rules.v4

# Save the iptables rules
sudo iptables-save > /etc/iptables/rules.v4

# Make sure the rules persist across reboots
sudo apt-get install -y iptables-persistent
