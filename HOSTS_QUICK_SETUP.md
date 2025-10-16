# 🚀 ODEUO Hosts Setup - Quick Start

## ⚡ 30-Second Setup

```bash
sudo ./add-hosts.sh
```

Done! 🎉

---

## 🌐 Access Your Services

| Service | URL |
|---------|-----|
| ODEUO Web | http://odeuo.local |
| **Twenty CRM** | **http://crm.odeuo.local** |
| n8n | http://n8n.odeuo.local |
| Admin | http://admin.odeuo.local |
| API | http://api.odeuo.local |
| Redis | http://redis.odeuo.local |
| pgAdmin | http://odeuo.local:8080 |
| Grafana | http://odeuo.local:3001 |

---

## ✅ What Gets Added

```
127.0.0.1    odeuo.local
127.0.0.1    admin.odeuo.local
127.0.0.1    api.odeuo.local
127.0.0.1    crm.odeuo.local
127.0.0.1    n8n.odeuo.local
127.0.0.1    redis.odeuo.local
```

---

## 🔍 Verify It Worked

```bash
# Check entries
grep odeuo.local /etc/hosts

# Test DNS
ping odeuo.local

# Should resolve to 127.0.0.1
```

---

## 🆘 Troubleshooting

### DNS Not Working?
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

### Can't Run Script?
```bash
# Make it executable
chmod +x add-hosts.sh

# Run with sudo
sudo ./add-hosts.sh
```

### Manual Setup?
See `HOSTS_SETUP_MANUAL.md`

---

## 📚 More Info

- **Full Guide**: `HOSTS_SETUP_MANUAL.md`
- **URL Reference**: `LOCAL_URLS.md`
- **Complete Info**: `HOSTS_SETUP_COMPLETE.md`

---

## 🎯 Next Steps

1. Run: `sudo ./add-hosts.sh`
2. Verify: `ping odeuo.local`
3. Access: http://odeuo.local
4. Enjoy! 🎉

---

## 💡 Pro Tips

- Backup created automatically: `/etc/hosts.backup.*`
- DNS cache flushed automatically
- All entries verified automatically
- Works with all services (ODEUO, Twenty, n8n, etc.)

---

**That's it!** Your hosts are now configured. 🚀

