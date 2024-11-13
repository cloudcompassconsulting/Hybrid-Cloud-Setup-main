[Interface]
# Clave privada para la interfaz del servidor WireGuard; esta clave debe ser secreta.
PrivateKey = YOUR PRIVATE KEY 2

# Puerto de escucha de la interfaz WireGuard para conexiones entrantes.
ListenPort = 55107

# Dirección IP y subred de la interfaz de WireGuard; actúa como la IP privada de la VPN en este servidor.
Address = 10.0.0.1/24

# Configuración de PostUp: comandos que se ejecutan después de iniciar la interfaz de WireGuard.
# Estas reglas de iptables redirigen tráfico TCP entrante hacia el puerto 80 a la IP interna 10.0.0.2.
# Cambia la IP de origen (SNAT) al tráfico saliente a 1.2.3.4 para asegurar el enrutamiento adecuado.
PostUp = iptables -t nat -A PREROUTING -p tcp -i eth0 '!' --dport 80 -j DNAT --to-destination 10.0.0.2; iptables -t nat -A POSTROUTING -o eth0 -j SNAT --to-source 1.2.3.4
PostUp = iptables -t nat -A PREROUTING -p tcp -i eth0 '!' --dport 443 -j DNAT --to-destination 10.0.0.2; iptables -t nat -A POSTROUTING -o eth0 -j SNAT --to-source 1.2.3.4

# Configuración de PostDown: comandos que se ejecutan al detener la interfaz de WireGuard.
# Estas reglas eliminan las configuraciones de iptables previamente establecidas en PostUp.
# Asegura que el tráfico TCP en puertos 80 y 443 deje de redirigirse después de cerrar la interfaz.
PostDown = iptables -t nat -D PREROUTING -p tcp -i eth0 '!' --dport 80 -j DNAT --to-destination 10.0.0.2; iptables -t nat -D POSTROUTING -o eth0 -j SNAT --to-source 1.2.3.4
PostDown = iptables -t nat -D PREROUTING -p tcp -i eth0 '!' --dport 443 -j DNAT --to-destination 10.0.0.2; iptables -t nat -D POSTROUTING -o eth0 -j SNAT --to-source 1.2.3.4

# Redirige y elimina tráfico UDP no destinado al puerto 55107 desde la interfaz `eth0` a la IP interna 10.0.0.2.
PostDown = iptables -t nat -D PREROUTING -p udp -i eth0 '!' --dport 55107 -j DNAT --to-destination 10.0.0.2;

[Peer]
# Clave pública del peer (dispositivo o servidor al otro lado de la conexión VPN).
PublicKey = YOUR PUBLIC KEY 2

# IP permitida para el peer; esta dirección define el rango de IP que este peer puede usar en la VPN.
AllowedIPs = 10.0.0.2/32
