#!/bin/bash

# Test runner for IMDB Coda Pack
# Uses `npx coda execute` to test formulas against live APIs

set -e

PACK_PATH="pack.ts"
FLAGS="--allowMultipleNetworkDomains"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

run_test() {
    local name="$1"
    local formula="$2"
    shift 2
    local args=("$@")
    
    echo -n "Testing: $name... "
    
    # Build the command with quoted arguments
    local cmd="npx coda execute $PACK_PATH $formula $FLAGS"
    for arg in "${args[@]}"; do
        cmd="$cmd \"$arg\""
    done
    
    if output=$(eval "$cmd" 2>&1); then
        echo -e "${GREEN}PASSED${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}FAILED${NC}"
        echo "$output"
        ((FAILED++))
        return 1
    fi
}

run_test_contains() {
    local name="$1"
    local expected="$2"
    local formula="$3"
    shift 3
    local args=("$@")
    
    echo -n "Testing: $name... "
    
    # Build the command with quoted arguments
    local cmd="npx coda execute $PACK_PATH $formula $FLAGS"
    for arg in "${args[@]}"; do
        cmd="$cmd \"$arg\""
    done
    
    if output=$(eval "$cmd" 2>&1); then
        if echo "$output" | grep -q "$expected"; then
            echo -e "${GREEN}PASSED${NC}"
            ((PASSED++))
            return 0
        else
            echo -e "${RED}FAILED${NC} (expected to contain: $expected)"
            echo "$output" | head -20
            ((FAILED++))
            return 1
        fi
    else
        echo -e "${RED}FAILED${NC}"
        echo "$output"
        ((FAILED++))
        return 1
    fi
}

echo ""
echo "========================================"
echo "  IMDB Coda Pack Test Suite"
echo "========================================"
echo ""

# Movie Tests
echo -e "${YELLOW}Movie Formula Tests${NC}"
echo "----------------------------------------"

run_test_contains "Movie by IMDB ID (Inception)" "tt1375666" "Movie" "tt1375666"
run_test_contains "Movie search (Dune 2021)" "tt1160419" "Movie" "Dune (2021)"
run_test_contains "Movie search (Dune 1984)" "tt0087182" "Movie" "Dune (1984)"
run_test_contains "Movie with country code" "WatchLinks" "Movie" "Inception" "US"
run_test_contains "Movie includes director" "Christopher Nolan" "Movie" "tt1375666"
run_test_contains "Movie includes trailer" "youtube.com" "Movie" "tt1375666"
run_test_contains "Movie includes box office" "GlobalGross" "Movie" "tt1375666"

echo ""

# Series Tests
echo -e "${YELLOW}Series Formula Tests${NC}"
echo "----------------------------------------"

run_test_contains "Series search (Breaking Bad)" "tt0903747" "Series" "Breaking Bad"
run_test_contains "Series by IMDB ID" "Breaking Bad" "Series" "tt0903747"
run_test_contains "Series includes seasons" "SeasonNumber" "Series" "Breaking Bad"
run_test_contains "Series includes network" "AMC" "Series" "Breaking Bad"
run_test_contains "Series includes status" "Ended" "Series" "Breaking Bad"
run_test_contains "Series includes trailer" "youtube.com" "Series" "Breaking Bad"
run_test_contains "Series includes content rating" "TV-MA" "Series" "Breaking Bad"

echo ""

# Person Tests
echo -e "${YELLOW}Person Formula Tests${NC}"
echo "----------------------------------------"

run_test_contains "Person search (Tom Hanks)" "nm0000158" "Person" "Tom Hanks"
run_test_contains "Person by IMDB ID" "Tom Hanks" "Person" "nm0000158"
run_test_contains "Person includes roles" "actor" "Person" "Tom Hanks"
run_test_contains "Person includes bio" "Concord, California" "Person" "Tom Hanks"
run_test_contains "Person includes birth date" "1956-07-09" "Person" "Tom Hanks"
run_test_contains "Person includes height" "cm" "Person" "Tom Hanks"
run_test_contains "Person includes known for" "KnownFor" "Person" "Tom Hanks"

echo ""

# Summary
echo "========================================"
echo "  Test Results"
echo "========================================"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
else
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
fi
