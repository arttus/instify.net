#!/bin/bash

# Test script for ODEUO local development endpoints
# This script tests various endpoints to diagnose issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
HOST="${1:-localhost}"
PORT="${2:-3005}"
TIMEOUT=10

echo "========================================="
echo "ODEUO Endpoint Test Suite"
echo "========================================="
echo "Host: $HOST"
echo "Port: $PORT"
echo "Timeout: ${TIMEOUT}s"
echo "========================================="
echo ""

# Test counter
PASSED=0
FAILED=0
TOTAL=0

# Function to test an endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_code="$3"
    local timeout="${4:-$TIMEOUT}"
    
    TOTAL=$((TOTAL + 1))
    echo -n "Testing $name... "
    
    # Make request with timeout
    response=$(curl -s -o /dev/null -w "%{http_code}" -m "$timeout" "$url" 2>&1)
    
    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $response)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_code, Got: $response)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Function to test endpoint with response time
test_endpoint_timed() {
    local name="$1"
    local url="$2"
    local expected_code="$3"
    local max_time="${4:-5}"
    
    TOTAL=$((TOTAL + 1))
    echo -n "Testing $name... "
    
    # Make request and measure time
    start_time=$(date +%s%N)
    response=$(curl -s -o /dev/null -w "%{http_code}" -m "$TIMEOUT" "$url" 2>&1)
    end_time=$(date +%s%N)
    
    # Calculate elapsed time in seconds
    elapsed=$((($end_time - $start_time) / 1000000000))
    
    if [ "$response" = "$expected_code" ]; then
        if [ "$elapsed" -le "$max_time" ]; then
            echo -e "${GREEN}✓ PASSED${NC} (HTTP $response, ${elapsed}s)"
            PASSED=$((PASSED + 1))
            return 0
        else
            echo -e "${YELLOW}⚠ SLOW${NC} (HTTP $response, ${elapsed}s > ${max_time}s)"
            PASSED=$((PASSED + 1))
            return 0
        fi
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_code, Got: $response, ${elapsed}s)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

echo "=== Basic Connectivity Tests ==="
echo ""

# Test 1: API Test Route (should be fast)
test_endpoint_timed "API Test Route" "http://$HOST:$PORT/api/test" "200" 2

# Test 2: Simple Test Page (minimal, should be fast)
test_endpoint_timed "Simple Test Page" "http://$HOST:$PORT/test-simple" "200" 5

# Test 3: Test Page (with HTML, should be reasonably fast)
test_endpoint_timed "Test Page" "http://$HOST:$PORT/test" "200" 10

# Test 4: Home Page (complex, may be slow)
echo ""
echo "=== Complex Page Tests ==="
echo ""
test_endpoint "Home Page" "http://$HOST:$PORT/" "200" 60

# Test 5: Health Check (if exists)
test_endpoint "Health Check" "http://$HOST:$PORT/api/health" "200" 2

echo ""
echo "========================================="
echo "Test Results"
echo "========================================="
echo -e "Total:  $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "========================================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed.${NC}"
    exit 1
fi

