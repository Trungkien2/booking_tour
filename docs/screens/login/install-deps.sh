#!/bin/bash

echo "🚀 Installing Login Feature Dependencies..."

# Backend dependencies
echo ""
echo "📦 Installing Backend Dependencies..."
cd apps/server
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt passport-local bcrypt @nestjs/throttler
pnpm add -D @types/passport-jwt @types/passport-local @types/bcrypt

# Frontend dependencies
echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../web
pnpm add react-hook-form @hookform/resolvers zod zustand

echo ""
echo "✅ All dependencies installed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Configure environment variables (.env files)"
echo "2. Import AuthModule into AppModule"
echo "3. Implement business logic (search for TODO comments)"
echo "4. Test the login flow"
