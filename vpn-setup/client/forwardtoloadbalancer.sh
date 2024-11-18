sudo iptables -t nat -A PREROUTING -i wg0 -p tcp -m tcp --dport 80 -j DNAT --to-destination 192.168.8.60:80 #Note the IP address of the load balancer is set to 192.168.8.60 on the router as a static hosts
sudo iptables -t nat -A PREROUTING -i wg0 -p tcp -m tcp --dport 443 -j DNAT --to-destination 192.168.8.60:443
