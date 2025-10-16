# Adding ODEUO Local Hosts Entries

## Option 1: Automatic (Recommended)

Run the provided script:

```bash
sudo ./add-hosts.sh
```

This will:
- Create a backup of your hosts file
- Add all ODEUO local entries
- Flush DNS cache
- Verify the entries

---

## Option 2: Manual Setup

### Step 1: Open Terminal

```bash
sudo nano /etc/hosts
```

### Step 2: Add These Entries

Scroll to the end of the file and add:

```
# ODEUO Local Development
127.0.0.1    odeuo.local
127.0.0.1    admin.odeuo.local
127.0.0.1    api.odeuo.local
127.0.0.1    crm.odeuo.local
127.0.0.1    n8n.odeuo.local
127.0.0.1    redis.odeuo.local
```

### Step 3: Save and Exit

- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### Step 4: Flush DNS Cache

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

---

## Option 3: Using a Script

Copy and paste this into your terminal:

```bash
sudo bash -c 'cat >> /etc/hosts << EOF

# ODEUO Local Development
127.0.0.1    odeuo.local
127.0.0.1    admin.odeuo.local
127.0.0.1    api.odeuo.local
127.0.0.1    crm.odeuo.local
127.0.0.1    n8n.odeuo.local
127.0.0.1    redis.odeuo.local
EOF'
```

Then flush DNS:

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

---

## Verify Setup

Check that entries were added:

```bash
grep odeuo.local /etc/hosts
```

You should see:

```
127.0.0.1    odeuo.local
127.0.0.1    admin.odeuo.local
127.0.0.1    api.odeuo.local
127.0.0.1    crm.odeuo.local
127.0.0.1    n8n.odeuo.local
127.0.0.1    redis.odeuo.local
```

---

## Test DNS Resolution

```bash
ping -c 1 odeuo.local
ping -c 1 crm.odeuo.local
ping -c 1 n8n.odeuo.local
```

All should resolve to `127.0.0.1`

---

## Access Your Services

Once added, you can access:

| Service | URL |
|---------|-----|
| ODEUO Web | http://odeuo.local |
| Admin | http://admin.odeuo.local |
| API | http://api.odeuo.local |
| **Twenty CRM** | **http://crm.odeuo.local** |
| n8n | http://n8n.odeuo.local |
| Redis | http://redis.odeuo.local |

---

## Backup Your Hosts File

Before making changes, create a backup:

```bash
sudo cp /etc/hosts /etc/hosts.backup
```

To restore:

```bash
sudo cp /etc/hosts.backup /etc/hosts
```

---

## Troubleshooting

### DNS Not Resolving?

Flush cache again:

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

### Can't Edit Hosts File?

Make sure you're using `sudo`:

```bash
sudo nano /etc/hosts
```

### Want to Remove Entries?

Edit the file and delete the ODEUO section:

```bash
sudo nano /etc/hosts
```

Then flush DNS cache again.

---

## What These Entries Do

Each entry maps a domain name to your local machine (127.0.0.1):

- `odeuo.local` → Main ODEUO application
- `admin.odeuo.local` → Admin panel
- `api.odeuo.local` → API endpoint
- `crm.odeuo.local` → Twenty CRM (NEW!)
- `n8n.odeuo.local` → n8n automation
- `redis.odeuo.local` → Redis admin

This allows you to access services using friendly domain names instead of IP addresses and ports.

---

## Next Steps

1. Add the hosts entries using one of the options above
2. Verify with: `grep odeuo.local /etc/hosts`
3. Flush DNS cache
4. Test with: `ping odeuo.local`
5. Access services via the URLs above

---

## Need Help?

If you have issues:

1. Check entries were added: `cat /etc/hosts | grep odeuo`
2. Verify DNS cache was flushed
3. Try accessing via IP instead: `http://localhost:3002` for Twenty
4. Check Docker services are running: `docker-compose ps`

