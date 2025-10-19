# Quick Deploy Guide for New Law Firm Client

## Step 1: Clone Template

```bash
# Clone your law firm template repo
git clone https://github.com/your-username/law-firm-template client-lawfirm-site
cd client-lawfirm-site

# Create new git repo for this client
rm -rf .git
git init
git add .
git commit -m "Initial commit for [Client Name]"
```

## Step 2: Create Environment File

Create `.env.local` with these variables:

```bash
# ===== REQUIRED =====

# Payload Secret (generate a random 32+ character string)
# Use: openssl rand -base64 32
PAYLOAD_SECRET=your-generated-secret-here

# Database Connection
# Option A: Vercel Postgres (will create in step 3)
DATABASE_URI=postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb

# Option B: MongoDB Atlas (free tier)
# DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Server URL (update after deployment)
NEXT_PUBLIC_SERVER_URL=http://localhost:3000


# ===== BRANDING =====

NEXT_PUBLIC_FIRM_NAME=Smith & Associates Law Firm
NEXT_PUBLIC_PRIMARY_COLOR=#1e40af
NEXT_PUBLIC_PHONE=(555) 555-5555
NEXT_PUBLIC_EMAIL=contact@smithlawfirm.com
NEXT_PUBLIC_ADDRESS=123 Main Street, City, ST 12345


# ===== OPTIONAL =====

# Email (for password resets, notifications)
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USER=apikey
# SMTP_PASS=your-sendgrid-api-key
# EMAIL_FROM=noreply@smithlawfirm.com

# File Storage (Vercel Blob for production)
# BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
```

## Step 3: Deploy to Vercel

### 3A: Via CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Project name: client-lawfirm-site
# - Framework: Next.js
# - Link to existing project? No
# - Deploy to production? Yes
```

### 3B: Via GitHub

```bash
# Push to GitHub
gh repo create client-lawfirm-site --private --source=. --remote=origin --push

# Then in Vercel dashboard:
# 1. Click "Add New Project"
# 2. Import from GitHub
# 3. Select the repository
# 4. Add environment variables (from .env.local)
# 5. Deploy
```

## Step 4: Set Up Database

### Option A: Vercel Postgres (Recommended)

```bash
# In Vercel dashboard for this project:
# 1. Go to Storage tab
# 2. Click "Create Database"
# 3. Select "Postgres"
# 4. Choose "Free" plan
# 5. Copy DATABASE_URI
# 6. Add to Environment Variables in Vercel

# Or via CLI:
vercel env add DATABASE_URI
# Paste the connection string
```

### Option B: MongoDB Atlas

```bash
# 1. Go to mongodb.com/cloud/atlas
# 2. Create free cluster
# 3. Create database user
# 4. Whitelist IP (0.0.0.0/0 for all)
# 5. Get connection string
# 6. Add to Vercel environment variables
```

## Step 5: Update Environment Variables in Vercel

```bash
# Update all environment variables via CLI:
vercel env add PAYLOAD_SECRET production
vercel env add NEXT_PUBLIC_FIRM_NAME production
vercel env add NEXT_PUBLIC_PRIMARY_COLOR production
vercel env add NEXT_PUBLIC_PHONE production
vercel env add NEXT_PUBLIC_EMAIL production
# ... etc

# Or use Vercel dashboard:
# Settings > Environment Variables > Add
```

## Step 6: Redeploy with New Variables

```bash
# Trigger new deployment to pick up env variables
vercel --prod

# Or just push to main branch if using GitHub integration
git push origin main
```

## Step 7: Create First Admin User

```bash
# Once deployed, visit:
https://your-site.vercel.app/admin

# Create first user:
# - Email: admin@clientfirm.com
# - Password: (use password manager)
# - Name: Admin User
# - Role: admin
```

## Step 8: Add Custom Domain

```bash
# Via CLI:
vercel domains add clientfirm.com
vercel domains add www.clientfirm.com

# Then configure DNS:
# Add CNAME: www.clientfirm.com -> cname.vercel-dns.com
# Add A: clientfirm.com -> 76.76.21.21

# Or via Vercel dashboard:
# Settings > Domains > Add Domain
```

## Step 9: Initial Content Setup

Login to admin panel and create:

### 1. Practice Areas (at least 3)
```
Examples:
- Personal Injury
- Family Law
- Criminal Defense
- Estate Planning
```

### 2. Attorneys (at least 1)
```
- Name
- Title
- Photo (upload)
- Bio
- Practice Areas
- Contact info
```

### 3. FAQs (5-10 common questions)
```
Examples:
- "What should I bring to my first consultation?"
- "How much do you charge?"
- "How long will my case take?"
```

## Step 10: Configure AI Integration

Update your AI system to pull from this client's site:

```typescript
// In your AI receptionist config
const clientConfig = {
  firmDomain: 'clientfirm.com',
  apiEndpoint: 'https://clientfirm.com/api/ai-context',
  // ... other config
}

// Test the endpoint
curl https://clientfirm.com/api/ai-context?practiceArea=personal-injury
```

## Step 11: Test Everything

- [ ] Visit homepage
- [ ] Test navigation
- [ ] View attorney profiles
- [ ] View practice area pages
- [ ] Check FAQs display
- [ ] Test contact form
- [ ] Verify AI endpoint returns data
- [ ] Test admin panel login
- [ ] Upload test content
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit (aim for 90+)

## Step 12: Client Handoff

Send client:

1. **Admin Access**
   - URL: https://clientfirm.com/admin
   - Username: admin@clientfirm.com
   - Password: [from password manager]

2. **Documentation**
   - How to add attorneys
   - How to create practice areas
   - How to manage FAQs
   - How to upload images

3. **Support Contact**
   - Your support email
   - Response time expectations
   - Monthly check-in schedule

---

## Ongoing Management

### Monthly Tasks:
- [ ] Review analytics
- [ ] Check for content updates needed
- [ ] Update FAQs based on common questions
- [ ] Add new case studies (if available)
- [ ] Review AI performance logs

### Quarterly Tasks:
- [ ] Update attorney photos/bios
- [ ] Review and update practice area content
- [ ] Check for broken links
- [ ] Performance audit
- [ ] Security updates

---

## Cost Tracking Per Client

```
Setup (One-time):
- Domain registration: $12/year
- Initial deployment: 1-2 hours labor
- Content setup: 1-2 hours labor

Monthly Recurring:
- Vercel hosting: $0 (free tier) or $20 (pro)
- Database: $0 (free tier) or $20 (pro)
- Domain: $1/month
- Your AI service: $X/month
- Maintenance: ~30 min/month

Total Monthly Cost: $1-41/month
Your Monthly Fee: $200-500/month
Monthly Margin: $159-499/month
```

---

## Troubleshooting

### Build Fails
```bash
# Check logs
vercel logs

# Common issues:
# 1. Missing environment variables
# 2. TypeScript errors
# 3. Database connection issues
```

### Can't Access Admin Panel
```bash
# Ensure NEXT_PUBLIC_SERVER_URL is set correctly
# Check that DATABASE_URI is valid
# Try creating user again
```

### Images Not Loading
```bash
# Check Vercel Blob is configured
# Verify upload directory exists
# Check file permissions
```

### Database Connection Errors
```bash
# Verify DATABASE_URI format
# Check database is running
# Whitelist Vercel IPs if using MongoDB
```

---

## Quick Reference

### Important URLs
```
Production Site: https://clientfirm.com
Admin Panel: https://clientfirm.com/admin
API Endpoint: https://clientfirm.com/api
AI Context: https://clientfirm.com/api/ai-context
```

### Vercel CLI Commands
```bash
vercel                  # Deploy preview
vercel --prod          # Deploy production
vercel logs            # View logs
vercel env ls          # List env vars
vercel domains         # Manage domains
vercel inspect         # Get deployment info
```

### Payload CLI Commands
```bash
payload migrate        # Run migrations
payload seed           # Seed test data (if configured)
```

---

## Success Checklist

After deployment, verify:

✅ Site loads at custom domain
✅ SSL certificate is active (https)
✅ Admin panel accessible
✅ Can login with admin credentials
✅ Can create/edit content
✅ Images upload successfully
✅ AI endpoint returns JSON data
✅ Forms submit successfully
✅ Mobile responsive
✅ Lighthouse scores 90+
✅ Analytics tracking works
✅ Client trained on admin panel

---

## Next Client Deployment

Once you have this process down, you can deploy a new client site in:
- **Initial setup**: 30 minutes
- **Content population**: 1-2 hours (with client)
- **Testing & handoff**: 30 minutes

**Total**: 2-3 hours per new client

At scale (with automation scripts), this can drop to 1 hour per client! 🚀
