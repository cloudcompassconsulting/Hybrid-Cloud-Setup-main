# Hybrid Cloud Setup for E-commerce Application

## Overview
This repository provides a hybrid cloud setup for deploying an e-commerce application using Next.js for the frontend, WordPress for the backend, and Kubernetes for orchestration. Traffic is securely routed from a Google Cloud VPS to a local Kubernetes cluster via a VPN.

## Features
- Frontend: Next.js application for e-commerce.
- Backend: WordPress headless CMS with REST API.
- Orchestration: Kubernetes for local container management.
- Networking: Secure VPN setup using WireGuard for traffic redirection.
- Deployment: Dockerized and deployed on Kubernetes with CI/CD integration.

## Architecture
This architecture is designed to securely route traffic from the internet to a local Kubernetes cluster through a Google Cloud VPS acting as a VPN gateway. The application is separated into frontend, backend, and database components, all running in containers managed by Kubernetes.

Components and Workflow
1. Domain and DNS
- Cloudflare domain (probarra.xyz) routes incoming traffic to the VPS.
- A DNS A record points the domain to the VPS’s public IP.
2. Google Cloud VPS with WireGuard VPN
- The Google Cloud VPS serves as a gateway, using WireGuard to establish a secure VPN connection to the local network where    Kubernetes is deployed.
- WireGuard forwards requests from the internet to the local Kubernetes cluster.
3. Proxmox and Kubernetes Cluster
- Proxmox is used on a local mini PC to virtualize multiple nodes, forming the Kubernetes cluster.
- Kubernetes (via K3s) orchestrates containerized services, including the frontend, backend, and MySQL database, distributed 
  across virtual nodes.
4. Kubernetes Services
- Frontend (Next.js): Dockerized and deployed on Kubernetes, communicating with WordPress’s REST API.
- Backend (Headless WordPress): Acts as a CMS, delivering content to the frontend via REST API requests.
- Database (MySQL): Provides persistent storage for WordPress, managed as a service within Kubernetes.
5. Load Balancing and Ingress
- Traefik as an Ingress controller handles HTTPS routing within the cluster.
- MetalLB provides an internal load-balancer IP to balance traffic across Kubernetes services.
- Traefik manages SSL certificates using Cert-Manager, ensuring secure communication with external users.

## Prerequisites
- Node.js and npm for the frontend.
- Docker and Kubernetes for container management.
- Google Cloud Account for VPS setup.
- WireGuard for VPN.

## Installation and Setup
  1. Domain Setup:
  Acquire a domain from Cloudflare and configure DNS records.
  2. Set up Google Cloud VPS:
  Obtain a VPS on Google Cloud, configure public IP, and SSH access.
  3. Create and manage virtual machines:
  Use Proxmox to virtualize the Kubernetes cluster. The virtual machines for the worker and master nodes as well as the        client virtual machine for the WireGuard protocol are created from a template virtual machine.    
  5. VPN Configuration:
  Configure a secure VPN with WireGuard to connect the VPS with the local cluster. 
  6. Kubernetes Cluster Setup:
  Install K3s on the mini PC, configure nodes, and set up Traefik and MetalLB for load balancing.
  7. WordPress and MySQL Deployment:
  Deploy WordPress and MySQL containers on Kubernetes.
  8. Frontend (Next.js) Setup:
  Dockerize the Next.js application and deploy it on the Kubernetes cluster.
