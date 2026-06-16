#!/bin/bash

# KANHA Neural OS - Build Script
# For production builds

echo "KANHA Neural OS - Building Production Release"
echo "============================================="

echo "Installing dependencies..."
npm install

echo "Building Vite bundle..."
npm run build

echo "Building Electron app..."
npm run electron-build

echo "Build complete! Check ./release/ for artifacts."
