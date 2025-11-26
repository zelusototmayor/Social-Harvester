# Signal Harvester - Kamal Deployment Guide

This guide will walk you through deploying Signal Harvester to your Digital Ocean droplet using Kamal.

## Prerequisites

1. **Kamal installed** on your local machine:
   ```bash
   gem install kamal
   ```

2. **Docker Hub account** (or another container registry)
   - Create account at https://hub.docker.com
   - Create an access token: Account Settings → Security → New Access Token

3. **Digital Ocean Droplet** provisioned:
   - Ubuntu 22.04 or later recommended
   - Minimum 2GB RAM
   - SSH access configured
   - Docker installed (Kamal can install it for you if needed)

4. **Domain name** configured:
   - DNS A record pointing to your droplet's IP address
   - Wait for DNS propagation (can take a few minutes)

## Step 1: Configure Deployment Settings

### 1.1 Update `config/deploy.yml`

Edit the following values in `config/deploy.yml`:

```yaml
# Line 7: Your Docker Hub username
image: your-dockerhub-username/signal-harvester

# Line 11: Your Digital Ocean droplet IP
servers:
  web:
    hosts:
      - XXX.XXX.XXX.XXX  # Replace with your actual IP

# Line 13: Your domain name
labels:
  traefik.http.routers.signal-harvester.rule: Host(`yourdomain.com`)

# Line 20: Your Docker Hub username
registry:
  username: your-dockerhub-username

# Line 36: Same droplet IP for database
accessories:
  db:
    host: XXX.XXX.XXX.XXX

# Line 57: Your email for Let's Encrypt
certificatesresolvers.letsencrypt.acme.email: "your-email@example.com"
```

### 1.2 Create Environment Secrets

Create a `.env` file in your project root (this will NOT be committed to git):

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Docker Hub token from Step 1 prerequisite
KAMAL_REGISTRY_PASSWORD=your_dockerhub_access_token

# Database credentials (choose strong passwords!)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_database_password_here

# Database URL for the application
DATABASE_URL=postgresql://postgres:your_secure_database_password_here@db:5432/signal_harvester
```

## Step 2: Initialize Kamal Secrets

Kamal uses a special secrets file. Create it from your `.env`:

```bash
# Kamal will use your .env file, but you can also set secrets via:
kamal secrets fetch
```

## Step 3: First-Time Setup

### 3.1 Install Docker on Droplet (if needed)

```bash
kamal server bootstrap
```

This installs Docker and sets up the server environment.

### 3.2 Initialize the Application

```bash
kamal setup
```

This will:
- Build your Docker image
- Push it to Docker Hub
- Start the PostgreSQL database
- Deploy your application
- Configure Traefik for SSL/HTTPS
- Request Let's Encrypt certificates

**Note**: First deployment takes 5-10 minutes. Let it complete without interruption.

## Step 4: Verify Deployment

### 4.1 Check Application Status

```bash
kamal app details
```

### 4.2 Check Database Status

```bash
kamal accessory details db
```

### 4.3 View Application Logs

```bash
kamal app logs --follow
```

### 4.4 Test Your Site

Visit `https://yourdomain.com` in your browser. You should see:
- ✅ HTTPS enabled (padlock icon)
- ✅ Landing page loads
- ✅ Waitlist form accepts submissions

## Step 5: Subsequent Deployments

After making changes to your code:

```bash
# Deploy updates
kamal deploy

# Rollback if needed
kamal rollback
```

## Common Commands

```bash
# View app logs
kamal app logs --follow

# View database logs
kamal accessory logs db --follow

# SSH into your server
kamal app exec -i bash

# Access database console
kamal accessory exec db "psql -U postgres signal_harvester"

# Restart the app
kamal app restart

# Stop the app
kamal app stop

# Start the app
kamal app start

# Remove everything (DESTRUCTIVE)
kamal remove
```

## Database Management

### Connect to PostgreSQL

```bash
# Via Kamal
kamal accessory exec db "psql -U postgres signal_harvester"

# Or SSH to server and use Docker
ssh root@your-droplet-ip
docker exec -it signal-harvester-db psql -U postgres signal_harvester
```

### View Waitlist Entries

```sql
SELECT * FROM waitlist ORDER BY created_at DESC;
```

### Export Waitlist to CSV

```sql
\copy (SELECT email, platform, created_at FROM waitlist ORDER BY created_at) TO '/tmp/waitlist.csv' CSV HEADER;
```

Then download from server:
```bash
scp root@your-droplet-ip:/tmp/waitlist.csv ./waitlist.csv
```

## Troubleshooting

### Issue: Deployment Fails

```bash
# Check application logs
kamal app logs

# Check database logs
kamal accessory logs db

# Verify Docker is running on server
kamal server exec "docker ps"
```

### Issue: SSL Certificate Fails

- Ensure DNS is properly configured (A record points to droplet)
- Wait 5-10 minutes for Let's Encrypt to validate
- Check Traefik logs: `kamal traefik logs`

### Issue: Database Connection Fails

```bash
# Check database is running
kamal accessory details db

# Verify DATABASE_URL secret is set correctly
kamal config env show

# Restart database
kamal accessory restart db
```

### Issue: "Image not found" Error

- Verify Docker Hub credentials in `.env`
- Check image name in `config/deploy.yml` matches your Docker Hub username
- Try: `kamal build push` to manually push image

## Security Best Practices

1. **Strong Passwords**: Use randomly generated passwords for `POSTGRES_PASSWORD`
2. **Firewall**: Configure UFW on your droplet:
   ```bash
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw enable
   ```
3. **Regular Updates**: Keep your droplet updated:
   ```bash
   kamal server exec "apt update && apt upgrade -y"
   ```
4. **Backup Database**: Set up regular database backups
5. **Monitor Logs**: Regularly check logs for suspicious activity

## Cost Estimation (Digital Ocean)

- **Droplet** (Basic, 2GB RAM): ~$12/month
- **Bandwidth**: Included (1TB)
- **Backups** (optional): +20% of droplet cost
- **Total**: ~$15-20/month

## Next Steps

1. **Custom Domain**: Update DNS and `config/deploy.yml` with your domain
2. **Monitoring**: Consider adding monitoring (Sentry, LogDNA, etc.)
3. **Analytics**: Add Google Analytics or similar to landing page
4. **Email Integration**: Connect waitlist to email service (Mailchimp, SendGrid)
5. **Backup Strategy**: Implement automated database backups

## Support

For Kamal-specific issues, refer to:
- Official Docs: https://kamal-deploy.org
- GitHub: https://github.com/basecamp/kamal

For Signal Harvester deployment issues, check application logs and database connection.
