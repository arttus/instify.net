#!/bin/bash

# Docker connectivity test script
# Tests network connectivity between containers and from host

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================="
echo "Docker Connectivity Test Suite"
echo "========================================="
echo ""

# Test counter
PASSED=0
FAILED=0

test_result() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ FAILED${NC}"
        FAILED=$((FAILED + 1))
    fi
}

echo "=== Container Status ==="
echo ""
docker ps --filter name=odeuo --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

echo "=== Network Connectivity Tests ==="
echo ""

echo -n "1. Test odeuo-web container is running... "
docker ps --filter name=odeuo-web --filter status=running | grep -q odeuo-web
test_result

echo -n "2. Test odeuo-web can reach postgres... "
docker exec odeuo-web sh -c "nc -zv postgres 5432 2>&1" | grep -q "open"
test_result

echo -n "3. Test odeuo-web can reach redis... "
docker exec odeuo-web sh -c "nc -zv redis 6379 2>&1" | grep -q "open"
test_result

echo -n "4. Test Next.js is listening on port 3001... "
docker exec odeuo-web sh -c "netstat -tlnp 2>/dev/null | grep 3001" | grep -q "LISTEN"
test_result

echo -n "5. Test port 3005 is mapped on host... "
lsof -i :3005 | grep -q LISTEN
test_result

echo -n "6. Test internal curl to localhost:3001... "
timeout 5 docker exec odeuo-web curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/test | grep -q "200"
test_result

echo -n "7. Test host can connect to port 3005... "
timeout 5 curl -s -o /dev/null -w "%{http_code}" http://localhost:3005/api/test | grep -q "200"
test_result

echo ""
echo "=== Container Logs (last 20 lines) ==="
echo ""
docker-compose logs --tail=20 odeuo-web 2>&1 | grep -v "WARN\["

echo ""
echo "========================================="
echo "Test Results"
echo "========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "========================================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All connectivity tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some connectivity tests failed.${NC}"
    exit 1
fi

