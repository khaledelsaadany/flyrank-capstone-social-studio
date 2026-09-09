#!/usr/bin/env bash
set -e
echo "Starting Social Media Studio..."
npm install --silent
node scripts/seed.js
npm start
