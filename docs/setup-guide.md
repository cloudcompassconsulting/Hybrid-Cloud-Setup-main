# Setup Guide for Hybrid Cloud E-commerce Application

Welcome to the setup guide for the **Hybrid Cloud E-commerce Application**. This document provides detailed instructions to deploy an e-commerce platform using Next.js, WordPress and Kubernetes.

---

## Prerequisites
Before proceeding, ensure you have the following:
- **Accounts**:
  - Google Cloud for VPS setup.
  - Cloudflare for domain management.
  - Wordpress.
  - Stripe.
- **Infrastructure**:
  - Proxmox installed on a mini PC for Kubernetes virtualization.
  - Access to a router for static IP and DNS configuration.
- **Tools**:
  - Node.js and npm
  - Docker
  - Kubernetes CLI (`kubectl`)
  - Helm
  - WireGuard VPN
- **Knowledge**: Basic understanding of Linux, Kubernetes, and networking.

---

## Overview
This hybrid cloud architecture involves:
1. A **Google Cloud VPS** acting as a gateway and VPN server.
2. A local **Proxmox-based Kubernetes cluster** for application services.
3. Secure routing of internet traffic via WireGuard VPN.

---

## WordPress and Stripe Setup

This section covers the integration of WordPress as the CMS and Stripe as the payment gateway for your e-commerce application.

## Step 1: Set WordPress and Stripe.
### 1. Create Account
- Register for a **Stripe** account (https://stripe.com/) to enable payment processing.

### 2. Install WordPress Plugins
- Add the following plugins to your WordPress installation:
  - **JSON Basic Authentication** (version 0.1): Enables secure API communication.
  - **WooCommerce** (version 9.0.2): Adds e-commerce functionality to WordPress.

### 3. Generate Access Keys
- In WordPress, navigate to the **WooCommerce Settings** and connect your store to Stripe.
- Generate the API keys from Stripe's dashboard (Publishable Key and Secret Key) and configure them in the WooCommerce Stripe plugin.

### 4. Configure WordPress REST API
- Enable and test the WordPress REST API. Ensure the **JSON Basic Authentication** plugin is active to allow secure API calls.
- Test the WooCommerce API endpoints (e.g., products, orders) using tools like Postman or curl:
  ```bash
  curl -X GET https://yourwordpresssite.com/wp-json/wc/v3/products -u consumer_key:consumer_secret
  
1. Create a env file and update your WordPressSite URL and Frontend next.js URL.
• NEXT_PUBLIC_WORDPRESS_URL=https:// example.com
• NEXT_PUBLIC_SITE_URL=http://localhost.com ( This will be your frontend Next.js URL)
2. Add your wC_CONSUMER_KEY and WC_CONSUMER_SECRET to the . env by following WooCommerce > Settings > Advanced > REST API
3. In your WordPress Dashboard, Go to Settings > General > Site Address (URL) ( Set this to Frontend URL e.g. http://localhost:3000 during development)
4. Create the Header and Footer Menus In WordPress Dashboard and set them to HCMS Header menu and HCMS Footer Menu respectively.


## Step 2: Domain Configuration
1. Acquire a domain from Cloudflare (e.g., `yourdomain.com`).
2. Create a **DNS A record** pointing to the public IP of the Google Cloud VPS.


## Step 3: Set Up Google Cloud VPS
1. Provision a VPS with Ubuntu in Google Cloud.
2. Assign a static public IP.
3. Enable SSH access:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ssh-copy-id user@your-vps-ip
   ```

## Step 4: Create the VM's using the hipervisor Proxmox via CLI
1. Download the ISO using the GUI (https://cloud-images.ubuntu.com/lunar/current/lunar-server-cloudimg-amd64-disk-kvm.img)
2. Create the VM via CLI:
  ```bash
  qm create 5000 --memory 2048 --core 2 --name ubuntu-cloud --net0 virtio,bridge=vmbr0
cd /var/lib/vz/template/iso/
qm importdisk 5000 lunar-server-cloudimg-amd64-disk-kvm.img <YOUR STORAGE HERE>
qm set 5000 --scsihw virtio-scsi-pci --scsi0 <YOUR STORAGE HERE>:vm-5000-disk-0
qm set 5000 --ide2 <YOUR STORAGE HERE>:cloudinit
qm set 5000 --boot c --bootdisk scsi0
qm set 5000 --serial0 socket --vga serial0
  ```
3. Expand the VM disk size to a suitable size (suggested 10 GB)
4. Create the Cloud-Init template
5. Deploy new VMs by cloning the template (full clone)


## Step 4: Configure WireGuard VPN
1. **Install WireGuard on the VPS**:
   ```bash
   wget https://git.io/wireguard -O wireguard-install.sh
    bash wireguard-install.sh 
   ```
2. **Configure `iptables`** for traffic routing. Refer to:
   - [WireGuard Configuration](../vpn-setup/vps/wg_vps.sh) in this repository.
   - [WireGuard by mochman](https://github.com/mochman/Bypass_CGNAT).
3. **Set up WireGuard on the local client VM**:
   - Install wireguard in the client VM:
     ```bash
       wget https://git.io/wireguard -O wireguard-install.sh
      bash wireguard-install.sh
     ```
   - Create a configuration file (`wg0.conf`):
     [Wireguard Configuration](../vpn-setup/client/wg0.conf) in this repository.
   - Enable WireGuard as a service:
     ```bash
     sudo systemctl enable wg-quick@wg0
     sudo systemctl start wg-quick@wg0
     ```
   - Set the client IP tables (wireguard-client-iptables.sh):
     [Wireguard Configuration](../vpn-setup/client/wireguard-client-iptables.sh) in this repository.


## Step 5: Install K3s
1. **Install Traefik as an Ingress Controller**:
   - Refer to the [K3s deploy script](../k3s/k3s.sh). in this repository.


## Step 6: Set Up Wildcard SSL Certificates
1. Install **Helm**
   ```bash
   curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
   chmod 700 get_helm.sh
   ./get_helm.sh
   ```
2. Install **Traefik** using Helm:
   ```bash
   helm repo add traefik https://helm.traefik.io/traefik
   helm repo update
   kubectl create namespace traefik
   helm install --namespace=traefik traefik traefik/traefik --values=values.yaml
   ```
   - Apply middleware:
   ```bash
   kubectl apply -f default-headers.yaml
   ```
  - Install htpassword:
   ```bash
   sudo apt-get update
   sudo apt-get install apache2-utils
   ```
   - Generate a credential / password that’s base64 encoded:
   ```bash
   htpasswd -nb techno password | openssl base64
   ```
   - Apply secret:
   ```bash
   kubectl apply -f secret-dashboard.yaml
   ```
   - Apply middleware:
   ```bash
   kubectl apply -f middleware.yaml
   ```
   - Apply dashboard:
   ```bash
   kubectl apply -f ingress.yaml
   ```
3. Install **cert-manager**:
   ```bash
   helm repo add jetstack https://charts.jetstack.io
   helm repo update
   kubectl create namespace cert-manager
   kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.9.1/cert-manager.crds.yaml
   helm install cert-manager jetstack/cert-manager --namespace cert-manager --values=values.yaml --version v1.9.1   
   ```
   - Apply secrets:
   ```bash
   kubectl apply -f secret-cf-token.yaml
   kubectl apply -f letsencrypt-staging.yaml
   ```

4. Create de certs:
   From certificates/staging folder
   ```bash
   kubectl apply -f local-example-com.yaml
   ```    

5. Production
   ```bash
   kubectl apply -f letsencrypt-production.yaml
   kubectl apply -f local-example-com.yaml
   ```


## Step 7: Setting Up a Private Docker Registry
1.  Create the ConfigMap
   - Apply the ConfigMap for the registry configuration:
``` bash
   kubectl apply -f configmap-registry.yaml
```
2. Deploy the Registry
   - Run the Docker Registry inside the cluster using the deployment and service files:
``` bash
   kubectl apply -f configmap-registry.yaml
   kubectl apply -f deployment-registry.yaml
   kubectl apply -f service-registry.yaml
   kubectl apply -f ingress-registry.yaml
```
3. Push and update images using update-deployment.sh:
``` bash
  chmod +x update-deployment.sh
./update-deployment.sh
```
4. Test the Registry
   - Verify the registry is accessible:
``` bash
curl -X GET https://registry.local.example.com/v2/_catalog
```
5. Use the Registry
   - Authenticate Docker with your registry:
``` bash
docker login registry.local.example.com
```
6. Perform garbage collection to reclaim space:
  ```bash
  kubectl apply -f gc-registry.yaml
  ```

## Step 8: Update the deployment
Refer to the [update deployment script](../nextjs/headless-wp/update-deployment.sh). in this repository.


## Step 9: Application Deployment
### WordPress and MySQL
1. Apply the WordPress deployment:
   ```bash
   kubectl apply -f kubernetes/wordpress/deployment.yaml
   ```
2. Deploy MySQL:
   ```bash
   kubectl apply -f kubernetes/mysql/deployment.yaml
   ```

### Frontend (Next.js)
1. Dockerize the application (if not already done).
2. Deploy the frontend:
   ```bash
   kubectl apply -f kubernetes/nextjs/deployment.yaml
   ```


## Step 10: Testing and Validation
1. Verify all pods are running:
   ```bash
   kubectl get pods --all-namespaces
   ```

2. Check application accessibility:
   ```bash
   curl http://yourdomain.com
   ```

3. Confirm SSL certificate setup:
   ```bash
   kubectl describe certificate wildcard-cert
   ```

## Troubleshooting
### VPN Issues
- Verify the WireGuard service:
  ```bash
  sudo systemctl status wg-quick@wg0
  ```
- Check routing tables on the VPS:
  ```bash
  sudo iptables -t nat -L -v
  ```

### Kubernetes Pod Failures
- View pod logs:
  ```bash
  kubectl logs pod-name -n namespace
  ```

### DNS Resolution
- Verify Cloudflare DNS settings for your domain.


## Additional Resources
- [Techno Tim’s Wildcard Certificate Tutorial](https://technotim.live/posts/kube-traefik-cert-manager-le/#helm)
- [WireGuard by mochman](https://github.com/mochman/Bypass_CGNAT)
- [JimsGarage K3s Deploy Guide](https://github.com/JamesTurland/JimsGarage/tree/main/Kubernetes)


