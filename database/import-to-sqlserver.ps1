# PowerShell script to import data to SQL Server
# Run this script as Administrator

param(
    [string]$ServerInstance = "localhost\SONTIEN",
    [string]$Database = "HRManagementDB_New",
    [string]$UseWindowsAuth = $true
)

Write-Host "Starting SQL Server import process..." -ForegroundColor Green

# Check if SQL Server is running
try {
    $sqlService = Get-Service -Name "MSSQL*" | Where-Object {$_.Status -eq "Running"}
    if (-not $sqlService) {
        Write-Host "SQL Server service is not running. Please start SQL Server service first." -ForegroundColor Red
        exit 1
    }
    Write-Host "SQL Server service is running." -ForegroundColor Green
}
catch {
    Write-Host "Could not check SQL Server service status." -ForegroundColor Yellow
}

# Set the path to the SQL files
$schemaFile = ".\fixed-complete-schema.sql"
$dataFile = ".\fixed-vietnamese-sample-data.sql"

# Check if files exist
if (-not (Test-Path $schemaFile)) {
    Write-Host "Schema file not found: $schemaFile" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $dataFile)) {
    Write-Host "Data file not found: $dataFile" -ForegroundColor Red
    exit 1
}

Write-Host "Files found. Starting import..." -ForegroundColor Green

try {
    # Import schema
    Write-Host "Importing schema..." -ForegroundColor Yellow
    if ($UseWindowsAuth) {
        sqlcmd -S $ServerInstance -E -d $Database -i $schemaFile
    } else {
        $username = Read-Host "Enter SQL Server username"
        $password = Read-Host "Enter SQL Server password" -AsSecureString
        $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
        sqlcmd -S $ServerInstance -U $username -P $plainPassword -d $Database -i $schemaFile
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Schema imported successfully!" -ForegroundColor Green
    } else {
        Write-Host "Error importing schema. Exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }

    # Import data
    Write-Host "Importing sample data..." -ForegroundColor Yellow
    if ($UseWindowsAuth) {
        sqlcmd -S $ServerInstance -E -d $Database -i $dataFile
    } else {
        sqlcmd -S $ServerInstance -U $username -P $plainPassword -d $Database -i $dataFile
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Sample data imported successfully!" -ForegroundColor Green
    } else {
        Write-Host "Error importing sample data. Exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }

    # Verify data
    Write-Host "Verifying imported data..." -ForegroundColor Yellow
    $verifyQuery = @"
SELECT 'Users' as TableName, COUNT(*) as Count FROM Users
UNION ALL
SELECT 'Candidates', COUNT(*) FROM Candidates
UNION ALL
SELECT 'JobPostings', COUNT(*) FROM JobPostings
UNION ALL
SELECT 'Applications', COUNT(*) FROM Applications
UNION ALL
SELECT 'Interviews', COUNT(*) FROM Interviews
UNION ALL
SELECT 'Departments', COUNT(*) FROM Departments;
"@

    if ($UseWindowsAuth) {
        sqlcmd -S $ServerInstance -E -d $Database -Q $verifyQuery
    } else {
        sqlcmd -S $ServerInstance -U $username -P $plainPassword -d $Database -Q $verifyQuery
    }

    Write-Host "Import process completed successfully!" -ForegroundColor Green
    Write-Host "You can now run the HR Management System application." -ForegroundColor Cyan

}
catch {
    Write-Host "An error occurred during import: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
