# Exposing Local Server Apps Behind CGNAT using WireGuard and iptables

This repository provides scripts to set up a WireGuard VPN connection between a local server (behind CGNAT) and a VPS server. The setup allows the local server to expose applications running on specific ports to the internet, overcoming the limitations imposed by CGNAT.

## Prerequisites

- Linux-based local server with root access.
- Linux-based VPS server with root access.

## Server Setup

The `wg_vps.sh` script automates the setup process on the VPS server. It performs the following steps:

1. Installs WireGuard on the VPS server.
2. Prompts for the WireGuard client IP address and the name of the interface connected to the internet (e.g., eth0).
3. Enables IP forwarding and sets up iptables rules to allow traffic forwarding and port forwarding for the specified ports (e.g., 25, 80, 443).
4. Configures WireGuard and generates the server and client configuration files.
5. Sets up persistent iptables rules to load on boot.

To run the script, execute the following commands on the VPS server: wg_vps.sh
Follow the prompts and provide the necessary information to complete the setup.

## Client Setup

The `wg_client.sh` script automates the setup process on the local server. It performs the following steps:

1. Installs WireGuard on the local server.
2. Prompts for the VPS server's WireGuard configuration file path and the local server's WireGuard configuration file path.
3. Enables IP forwarding and sets up iptables rules to allow traffic forwarding and port forwarding for the specified ports (configured on the VPS server).
4. Configures WireGuard and loads the client configuration.

To run the script, execute the following commands on the local server: wg_client.sh
