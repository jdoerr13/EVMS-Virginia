# EVMS Database Setup Script
Write-Host "=== EVMS Database Setup ===" -ForegroundColor Green

# Prompt for PostgreSQL password
$password = Read-Host "Enter your PostgreSQL password for user 'postgres'" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

# Set environment variable
$env:PGPASSWORD = $plainPassword

Write-Host "Creating database..." -ForegroundColor Yellow
try {
    psql -U postgres -c "CREATE DATABASE evms_db;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Database might already exist, continuing..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error creating database: $_" -ForegroundColor Red
}

Write-Host "Running schema migration..." -ForegroundColor Yellow
try {
    psql -U postgres -d evms_db -f ../db/schema.sql
    Write-Host "Schema migration completed!" -ForegroundColor Green
} catch {
    Write-Host "Error running schema migration: $_" -ForegroundColor Red
}

Write-Host "Setting up admin users..." -ForegroundColor Yellow
try {
    npm run setup-admin
    Write-Host "Admin setup completed!" -ForegroundColor Green
} catch {
    Write-Host "Error setting up admin users: $_" -ForegroundColor Red
}

Write-Host "=== Database Setup Complete ===" -ForegroundColor Green
Write-Host "You can now start the server with: npm run dev" -ForegroundColor Cyan
