#!/bin/bash
echo "Starting 4kcz Scraper API on port 5000..."
echo "Cookie file: $(cat /workspace/4kcz_scraper/.cookie | head -c 30)..."
python3 api.py
