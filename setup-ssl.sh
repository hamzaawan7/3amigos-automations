#!/bin/bash

# SSL Certificate Setup Script for 3Amigos Portal
# This script helps generate and configure SSL certificate using Let's Encrypt

echo "================================================"
echo "SSL Certificate Setup for 3Amigos Portal"
echo "================================================"
echo ""

# Configuration
DOMAIN_NAME=""
WWW_DOMAIN=""
WEBROOT_PATH="/home/g0mbqxoz5uaj/public_html/portal/public"
EMAIL="" # Your email for Let's Encrypt notifications

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}IMPORTANT: Please provide the following information:${NC}"
echo ""

# Prompt for domain name
read -p "Enter your domain name (e.g., 3-amigos.co): " DOMAIN_NAME
read -p "Include www subdomain? (y/n): " INCLUDE_WWW

if [[ "$INCLUDE_WWW" == "y" || "$INCLUDE_WWW" == "Y" ]]; then
    WWW_DOMAIN="www.$DOMAIN_NAME"
fi

read -p "Enter your email for SSL notifications: " EMAIL

echo ""
echo "================================================"
echo "Configuration Summary:"
echo "================================================"
echo "Domain: $DOMAIN_NAME"
if [ ! -z "$WWW_DOMAIN" ]; then
    echo "WWW Domain: $WWW_DOMAIN"
fi
echo "Webroot: $WEBROOT_PATH"
echo "Email: $EMAIL"
echo "================================================"
echo ""

read -p "Continue with SSL certificate generation? (y/n): " CONFIRM

if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo -e "${GREEN}Starting SSL certificate generation...${NC}"
echo ""

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo -e "${RED}Certbot is not installed!${NC}"
    echo ""
    echo "Installing Certbot..."

    # Try to install certbot
    if command -v apt-get &> /dev/null; then
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-apache
    elif command -v yum &> /dev/null; then
        sudo yum install -y certbot python3-certbot-apache
    else
        echo -e "${RED}Could not automatically install certbot.${NC}"
        echo "Please install certbot manually:"
        echo "  Ubuntu/Debian: sudo apt-get install certbot python3-certbot-apache"
        echo "  CentOS/RHEL: sudo yum install certbot python3-certbot-apache"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}Certbot is installed. Generating SSL certificate...${NC}"
echo ""

# Generate SSL certificate
if [ ! -z "$WWW_DOMAIN" ]; then
    # With www subdomain
    sudo certbot certonly --webroot \
        -w "$WEBROOT_PATH" \
        -d "$DOMAIN_NAME" \
        -d "$WWW_DOMAIN" \
        --email "$EMAIL" \
        --agree-tos \
        --non-interactive \
        --keep-until-expiring
else
    # Without www subdomain
    sudo certbot certonly --webroot \
        -w "$WEBROOT_PATH" \
        -d "$DOMAIN_NAME" \
        --email "$EMAIL" \
        --agree-tos \
        --non-interactive \
        --keep-until-expiring
fi

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}================================================${NC}"
    echo -e "${GREEN}SSL Certificate generated successfully!${NC}"
    echo -e "${GREEN}================================================${NC}"
    echo ""
    echo "Certificate location:"
    echo "  Certificate: /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem"
    echo "  Private Key: /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Configure your web server (Apache/Nginx) to use the SSL certificate"
    echo "2. Update your .htaccess or server config to redirect HTTP to HTTPS"
    echo "3. Test your SSL: https://www.ssllabs.com/ssltest/"
    echo ""
    echo -e "${GREEN}Auto-renewal is configured by Certbot.${NC}"
    echo "Certificates will auto-renew before expiration."
    echo ""
else
    echo ""
    echo -e "${RED}SSL certificate generation failed!${NC}"
    echo ""
    echo "Common issues:"
    echo "1. Domain not pointing to this server"
    echo "2. Firewall blocking port 80/443"
    echo "3. Web server not properly configured"
    echo "4. Domain verification failed"
    echo ""
    echo "Please check:"
    echo "  - DNS records are correctly pointing to: 208.109.173.77"
    echo "  - Port 80 and 443 are open"
    echo "  - Web server is serving files from: $WEBROOT_PATH"
    exit 1
fi

