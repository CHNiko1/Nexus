# 🚀 Automated Setup Script for Vine Dropshipping

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Vine Dropshipping - Setup Wizard" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Node.js
Write-Host "Step 1: Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found!" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js first:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Download the LTS version (v20.x recommended)" -ForegroundColor White
    Write-Host "3. Run the installer" -ForegroundColor White
    Write-Host "4. Restart PowerShell and run this script again" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit
}

# Step 2: Check npm
Write-Host "Step 2: Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm $npmVersion found!" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Installing Dependencies" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "This may take 2-5 minutes..." -ForegroundColor Yellow
Write-Host ""

# Step 3: Install dependencies
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Installation failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

Write-Host ""
Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Step 4: Check for .env file
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Environment Configuration" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path ".env") {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
} else {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠ IMPORTANT: You need to configure your .env file!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Required configuration:" -ForegroundColor White
    Write-Host "1. DATABASE_URL - Your PostgreSQL connection string" -ForegroundColor White
    Write-Host "2. NEXTAUTH_SECRET - Generate with: openssl rand -base64 32" -ForegroundColor White
    Write-Host "3. STRIPE keys - Get from https://dashboard.stripe.com/test/apikeys" -ForegroundColor White
    Write-Host ""
    
    $editEnv = Read-Host "Would you like to open .env file now to edit it? (Y/N)"
    if ($editEnv -eq "Y" -or $editEnv -eq "y") {
        notepad .env
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Database Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$setupDb = Read-Host "Do you have PostgreSQL installed and DATABASE_URL configured? (Y/N)"

if ($setupDb -eq "Y" -or $setupDb -eq "y") {
    Write-Host ""
    Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
    npx prisma generate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Prisma Client generated!" -ForegroundColor Green
        Write-Host ""
        
        $pushDb = Read-Host "Push database schema? (Y/N)"
        if ($pushDb -eq "Y" -or $pushDb -eq "y") {
            Write-Host "Pushing schema to database..." -ForegroundColor Yellow
            npm run db:push
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ Database schema created!" -ForegroundColor Green
                Write-Host ""
                
                $seedDb = Read-Host "Seed database with sample data? (Y/N)"
                if ($seedDb -eq "Y" -or $seedDb -eq "y") {
                    Write-Host "Seeding database..." -ForegroundColor Yellow
                    npm run db:seed
                    
                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "✓ Database seeded!" -ForegroundColor Green
                        Write-Host ""
                        Write-Host "Default Admin Credentials:" -ForegroundColor Cyan
                        Write-Host "Email: admin@vine.com" -ForegroundColor White
                        Write-Host "Password: admin123" -ForegroundColor White
                        Write-Host ""
                        Write-Host "Default User Credentials:" -ForegroundColor Cyan
                        Write-Host "Email: user@example.com" -ForegroundColor White
                        Write-Host "Password: password123" -ForegroundColor White
                    }
                }
            }
        }
    }
} else {
    Write-Host ""
    Write-Host "⚠ Database setup skipped!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To set up later:" -ForegroundColor White
    Write-Host "1. Install PostgreSQL" -ForegroundColor White
    Write-Host "2. Configure DATABASE_URL in .env" -ForegroundColor White
    Write-Host "3. Run: npx prisma generate" -ForegroundColor White
    Write-Host "4. Run: npm run db:push" -ForegroundColor White
    Write-Host "5. Run: npm run db:seed" -ForegroundColor White
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$startDev = Read-Host "Start development server now? (Y/N)"

if ($startDev -eq "Y" -or $startDev -eq "y") {
    Write-Host ""
    Write-Host "Starting development server..." -ForegroundColor Green
    Write-Host "The app will be available at: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    Start-Sleep -Seconds 2
    npm run dev
} else {
    Write-Host ""
    Write-Host "To start the server later, run:" -ForegroundColor White
    Write-Host "npm run dev" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Then visit: http://localhost:3000" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Thank you for using Vine!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
