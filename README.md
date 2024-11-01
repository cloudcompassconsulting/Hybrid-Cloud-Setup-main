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

## Prerequisites
- Node.js and npm for the frontend.
- Docker and Kubernetes for container management.
- Google Cloud Account for VPS setup.
- WireGuard for VPN.

## Installation and Setup
  ## 1. Domain Setup
  Acquire a domain from Cloudflare and configure DNS records.
  ## 2. Set up Google Cloud VPS
  Obtain a free-tier VPS on Google Cloud, configure public IP, and SSH access.
  ## 3. VPN Configuration
  Configure a secure VPN with WireGuard to connect the VPS with the local cluster.
  ## 4. Kubernetes Cluster Setup
  Install K3s on the mini PC, configure nodes, and set up Traefik and MetalLB for load balancing.
  ## 5. WordPress and MySQL Deployment
  Deploy WordPress and MySQL containers on Kubernetes with Helm.
  ## 6. Frontend (Next.js) Setup
  Dockerize the Next.js application and deploy it on the Kubernetes cluster.
