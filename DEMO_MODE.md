# 🚀 Quick Demo Mode - No Database Required!

While PostgreSQL installs, you can see the UI immediately!

## Start Demo Mode Now

```powershell
npm run dev
```

Then visit: **http://localhost:3000**

## What You'll See:

✅ Beautiful homepage design  
✅ Navigation and layout  
✅ Product catalog UI  
✅ Shopping cart interface  
✅ Admin dashboard design  
❌ Database features (will show errors - that's normal!)  

## What WON'T Work Yet:

- Product loading from database
- User authentication
- Order processing  
- Admin CRUD operations

These will work once PostgreSQL installation completes!

## After PostgreSQL Installs:

The installer will ask you to set a password. Use: **postgres123**

Then run these commands:

```powershell
# Update .env with your PostgreSQL password
$env:PGPASSWORD = "postgres123"
$envContent = Get-Content .env -Raw
$envContent = $envContent -replace 'DATABASE_URL=".*"', 'DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/vine_dropshipping"'
Set-Content .env $envContent

# Create database
& "C:\Program Files\PostgreSQL\17\bin\createdb.exe" -U postgres vine_dropshipping

# Push schema and seed data
npx prisma generate
npm run db:push
npm run db:seed

# Restart server
npm run dev
```

## Or Use This Automated Script:

```powershell
.\setup-db.ps1
```

---

**Start the demo now while waiting!** 🎉
