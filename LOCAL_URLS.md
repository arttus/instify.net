# 🌐 ODEUO Local URLs Guide

## Quick Access

Once you add the hosts entries, access your services using these friendly URLs:

---

## 📋 All Services

| Service | URL | Port | Purpose |
|---------|-----|------|---------|
| **ODEUO Web** | http://odeuo.local | 80 | Main application |
| **Twenty CRM** | http://crm.odeuo.local | 80 | CRM system (NEW!) |
| **n8n** | http://n8n.odeuo.local | 80 | Automation workflows |
| **Admin Panel** | http://admin.odeuo.local | 80 | Admin interface |
| **API** | http://api.odeuo.local | 80 | API endpoint |
| **Redis** | http://redis.odeuo.local | 80 | Redis admin |
| **pgAdmin** | http://odeuo.local:8080 | 8080 | Database admin |
| **Grafana** | http://odeuo.local:3001 | 3001 | Monitoring |

---

## 🚀 Getting Started

### 1. Add Hosts Entries

```bash
sudo ./add-hosts.sh
```

Or manually add to `/etc/hosts`:

```
127.0.0.1    odeuo.local
127.0.0.1    admin.odeuo.local
127.0.0.1    api.odeuo.local
127.0.0.1    crm.odeuo.local
127.0.0.1    n8n.odeuo.local
127.0.0.1    redis.odeuo.local
```

### 2. Flush DNS Cache

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

### 3. Start Services

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### 4. Access Services

Open your browser and visit any of the URLs above!

---

## 🎯 Main Services

### ODEUO Web Application
- **URL**: http://odeuo.local
- **Port**: 80 (via Nginx)
- **Purpose**: Main ODEUO application
- **Access**: Direct from browser

### Twenty CRM (NEW!)
- **URL**: http://crm.odeuo.local
- **Port**: 80 (via Nginx) or 3002 (direct)
- **Purpose**: Customer Relationship Management
- **Access**: http://crm.odeuo.local or http://localhost:3002
- **Features**: Contacts, deals, workflows

### n8n Automation
- **URL**: http://n8n.odeuo.local
- **Port**: 80 (via Nginx) or 5678 (direct)
- **Purpose**: Workflow automation
- **Access**: http://n8n.odeuo.local or http://localhost:5678
- **Features**: Automate tasks, integrations

---

## 🔧 Development Tools

### pgAdmin (Database Admin)
- **URL**: http://odeuo.local:8080
- **Port**: 8080
- **Purpose**: PostgreSQL administration
- **Credentials**: admin@odeuo.dev / admin
- **Features**: Query builder, database management

### Grafana (Monitoring)
- **URL**: http://odeuo.local:3001
- **Port**: 3001
- **Purpose**: Metrics and monitoring
- **Credentials**: admin / (generated password)
- **Features**: Dashboards, alerts, metrics

### RedisInsight (Redis Admin)
- **URL**: http://redis.odeuo.local
- **Port**: 80 (via Nginx)
- **Purpose**: Redis administration
- **Features**: Key inspection, monitoring

---

## 🔐 Credentials

| Service | Username | Password |
|---------|----------|----------|
| pgAdmin | admin@odeuo.dev | admin |
| Grafana | admin | (generated) |
| n8n | admin | (generated) |
| Twenty CRM | (create on first login) | (create on first login) |

---

## 📊 Direct Access (Without Hosts)

If you haven't added hosts entries, access via direct URLs:

| Service | Direct URL |
|---------|-----------|
| ODEUO Web | http://localhost |
| Twenty CRM | http://localhost:3002 |
| n8n | http://localhost:5678 |
| pgAdmin | http://localhost:8080 |
| Grafana | http://localhost:3001 |
| RedisInsight | http://localhost:8002 |

---

## 🧪 Test DNS Resolution

Verify hosts entries are working:

```bash
# Test each domain
ping -c 1 odeuo.local
ping -c 1 crm.odeuo.local
ping -c 1 n8n.odeuo.local
ping -c 1 admin.odeuo.local
ping -c 1 api.odeuo.local
ping -c 1 redis.odeuo.local
```

All should resolve to `127.0.0.1`

---

## 🌍 Browser Bookmarks

Save these bookmarks for quick access:

```
ODEUO Local Development
├── ODEUO Web - http://odeuo.local
├── Twenty CRM - http://crm.odeuo.local
├── n8n - http://n8n.odeuo.local
├── Admin - http://admin.odeuo.local
├── API - http://api.odeuo.local
├── pgAdmin - http://odeuo.local:8080
├── Grafana - http://odeuo.local:3001
└── Redis - http://redis.odeuo.local
```

---

## 🔄 Workflow

### Typical Development Workflow

1. **Start Services**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
   ```

2. **Access Main App**
   - Open http://odeuo.local

3. **Access Twenty CRM**
   - Open http://crm.odeuo.local

4. **Set Up Automation**
   - Open http://n8n.odeuo.local
   - Create workflows

5. **Monitor**
   - Open http://odeuo.local:3001 (Grafana)
   - View metrics

6. **Manage Database**
   - Open http://odeuo.local:8080 (pgAdmin)
   - Query data

---

## 🛠️ Troubleshooting

### URLs Not Working?

1. **Check hosts entries**
   ```bash
   grep odeuo.local /etc/hosts
   ```

2. **Flush DNS cache**
   ```bash
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

3. **Check services running**
   ```bash
   docker-compose ps
   ```

4. **Try direct URL**
   - Use http://localhost:3002 instead of http://crm.odeuo.local

### DNS Still Not Resolving?

Try using IP directly:
- http://127.0.0.1 (ODEUO Web)
- http://127.0.0.1:3002 (Twenty CRM)
- http://127.0.0.1:5678 (n8n)

---

## 📝 Notes

- All services run on localhost (127.0.0.1)
- Nginx acts as reverse proxy for port 80
- Direct ports still work (3002, 5678, 8080, etc.)
- Hosts entries are local only (won't work on other machines)
- DNS cache needs to be flushed after adding entries

---

## 🎯 Quick Commands

```bash
# Add hosts entries
sudo ./add-hosts.sh

# Flush DNS
sudo dscacheutil -flushcache

# Check hosts
grep odeuo.local /etc/hosts

# Test DNS
ping odeuo.local

# Start services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f
```

---

## 🚀 You're Ready!

Once hosts entries are added and services are running, you can access all services using friendly URLs!

**Start with**: http://odeuo.local 🎉

