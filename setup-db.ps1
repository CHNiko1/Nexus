# Database Setup Script
# Run this after PostgreSQL installation completes

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Database Setup for Vine" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Get PostgreSQL password
$pgPassword = Read-Host "Enter the PostgreSQL password you set during installation" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword)
$pgPass = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Update .env file
Write-Host "Updating .env file..." -ForegroundColor Yellow
$envContent = Get-Content .env -Raw
$envContent = $envContent -replace 'DATABASE_URL=".*"', "DATABASE_URL=`"postgresql://postgres:$pgPass@localhost:5432/vine_dropshipping`""
Set-Content .env $envContent
Write-Host "✓ .env updated!" -ForegroundColor Green
Write-Host ""

# Set environment variable for createdb
$env:PGPASSWORD = $pgPass

# Create database
Write-Host "Creating database..." -ForegroundColor Yellow
try {
    & "C:\Program Files\PostgreSQL\17\bin\createdb.exe" -U postgres vine_dropshipping 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database created!" -ForegroundColor Green
    } else {
        Write-Host "✓ Database already exists!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Database might already exist (this is OK)" -ForegroundColor Yellow
}
Write-Host ""

# Generate Prisma Client
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
Write-Host "✓ Prisma Client generated!" -ForegroundColor Green
Write-Host ""

# Push schema
Write-Host "Creating database schema..." -ForegroundColor Yellow
npm run db:push
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Schema created!" -ForegroundColor Green
} else {
    Write-Host "✗ Schema push failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}
Write-Host ""

# Seed database
Write-Host "Seeding database with sample data..." -ForegroundColor Yellow
npm run db:seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database seeded!" -ForegroundColor Green
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "Login Credentials:" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "Admin Email: admin@vine.com" -ForegroundColor White
    Write-Host "Admin Password: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "User Email: user@example.com" -ForegroundColor White
    Write-Host "User Password: password123" -ForegroundColor White
} else {
    Write-Host "✗ Seeding failed!" -ForegroundColor Red
}
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Start the server with: npm run dev" -ForegroundColor Green
Write-Host ""
