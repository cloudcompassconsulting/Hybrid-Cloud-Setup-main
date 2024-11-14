#!/bin/bash
sudo wg-quick down wg0

DEPLOYMENT_NAME="nextjs-app"
NAMESPACE="default"
IMAGE="registry.local.probarra.xyz/probarra-nextjs-app:local"


# Tag and push the image to the local registry
sudo docker buildx build --platform linux/amd64 -t probarra-nextjs-app:local .
sudo docker tag probarra-nextjs-app:local registry.local.probarra.xyz/probarra-nextjs-app:local
sudo docker push registry.local.probarra.xyz/probarra-nextjs-app:local

# Update the deployment with the new image
#kubectl set image deployment/$DEPLOYMENT_NAME nextjs-app=$IMAGE -n $NAMESPACE

# Optionally, you can force a rollout restart to ensure the pods are updated
kubectl rollout restart deployment/$DEPLOYMENT_NAME -n $NAMESPACE

sudo wg-quick up wg0
