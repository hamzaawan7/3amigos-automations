# SSL Certificate Setup Guide

## Quick Setup (Recommended)

### Option 1: Using the Automated Script

1. **Upload the script to your server:**
   ```bash
   scp setup-ssl.sh g0mbqxoz5uaj@208.109.173.77:~/
   ```

2. **SSH into your server:**
   ```bash
   ssh g0mbqxoz5uaj@208.109.173.77
   ```

3. **Run the setup script:**
   ```bash
   chmod +x setup-ssl.sh
   ./setup-ssl.sh
   ```

4. **Follow the prompts:**
   - Enter your domain name (e.g., 3-amigos.co)
   - Choose whether to include www subdomain
   - Enter your email for SSL notifications
   - Confirm to proceed

---

## Option 2: Manual Setup

### Step 1: SSH into your server
```bash
ssh g0mbqxoz5uaj@208.109.173.77
```

### Step 2: Install Certbot (if not already installed)
```bash
# For Ubuntu/Debian
sudo apt-get update
sudo apt-get install certbot python3-certbot-apache

# For CentOS/RHEL
sudo yum install certbot python3-certbot-apache
```

### Step 3: Generate SSL Certificate

**For a single domain:**
```bash
sudo certbot certonly --webroot \
  -w /home/g0mbqxoz5uaj/public_html/portal/public \
  -d yourdomain.com \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive
```

**For domain + www subdomain:**
```bash
sudo certbot certonly --webroot \
  -w /home/g0mbqxoz5uaj/public_html/portal/public \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --email your-email@example.com \
  --agree-tos \
  --non-interactive
```

### Step 4: Configure Apache/Nginx

**For Apache (.htaccess already in place):**
The Laravel .htaccess file should handle HTTPS redirection. If not, add:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

**For Nginx:**
Add this to your server block:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    root /home/g0mbqxoz5uaj/public_html/portal/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### Step 5: Test SSL Configuration
```bash
# Restart web server
sudo systemctl restart apache2  # or nginx

# Test SSL certificate
sudo certbot certificates
```

---

## Troubleshooting

### Issue: "Domain not pointing to this server"
**Solution:**
1. Check DNS records:
   ```bash
   nslookup yourdomain.com
   dig yourdomain.com
   ```
2. Ensure A record points to: `208.109.173.77`
3. Wait for DNS propagation (can take up to 48 hours)

### Issue: "Port 80/443 blocked"
**Solution:**
```bash
# Check if ports are open
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Check firewall
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Issue: "Webroot verification failed"
**Solution:**
1. Ensure webroot path is correct:
   ```bash
   ls -la /home/g0mbqxoz5uaj/public_html/portal/public
   ```
2. Check web server is serving from correct directory
3. Test by creating a test file:
   ```bash
   echo "test" > /home/g0mbqxoz5uaj/public_html/portal/public/test.txt
   curl http://yourdomain.com/test.txt
   ```

---

## Certificate Locations

After successful generation:
- **Certificate:** `/etc/letsencrypt/live/yourdomain.com/fullchain.pem`
- **Private Key:** `/etc/letsencrypt/live/yourdomain.com/privkey.pem`
- **Chain:** `/etc/letsencrypt/live/yourdomain.com/chain.pem`
- **Certificate + Key:** `/etc/letsencrypt/live/yourdomain.com/cert.pem`

---

## Auto-Renewal

Certbot automatically sets up renewal. Test it:
```bash
sudo certbot renew --dry-run
```

The cron job is usually at:
```bash
# Check existing cron jobs
sudo crontab -l

# Typical certbot renewal cron
0 0,12 * * * python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew --quiet
```

---

## Testing SSL

After setup, test your SSL certificate:
1. Visit: https://www.ssllabs.com/ssltest/
2. Enter your domain
3. Wait for analysis
4. Aim for an A+ rating

---

## Quick Commands Reference

```bash
# Check certificate status
sudo certbot certificates

# Renew all certificates
sudo certbot renew

# Renew specific certificate
sudo certbot renew --cert-name yourdomain.com

# Revoke certificate
sudo certbot revoke --cert-path /etc/letsencrypt/live/yourdomain.com/cert.pem

# Delete certificate
sudo certbot delete --cert-name yourdomain.com
```

---

## Support

If you encounter issues:
1. Check Certbot logs: `/var/log/letsencrypt/letsencrypt.log`
2. Check web server logs: `/var/log/apache2/error.log` or `/var/log/nginx/error.log`
3. Verify DNS: https://mxtoolbox.com/SuperTool.aspx
4. Test ports: https://www.yougetsignal.com/tools/open-ports/

