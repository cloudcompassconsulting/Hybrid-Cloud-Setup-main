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

# forward to the loadbalancer
sudo iptables -t nat -A PREROUTING -i wg0 -p tcp -m tcp --dport 80 -j DNAT --to-destination 192.168.8.60:80 #Note the IP address of the load balancer is set to 192.168.8.60 on the router as a static hosts
sudo iptables -t nat -A PREROUTING -i wg0 -p tcp -m tcp --dport 443 -j DNAT --to-destination 192.168.8.60:443
