#!/bin/bash

# Bash script to import data to SQL Server on Linux
# Make sure SQL Server is installed and running

SERVER_INSTANCE="localhost"
DATABASE="HRManagementDB_New"
USERNAME="sa"
PASSWORD="YourPassword123!"  # Change this to your actual password

echo "Starting SQL Server import process..."

# Check if sqlcmd is available
if ! command -v sqlcmd &> /dev/null; then
    echo "sqlcmd is not installed. Please install SQL Server command line tools first."
    echo "Run: sudo apt-get install mssql-tools unixodbc-dev"
    exit 1
fi

# Check if SQL Server is running
if ! pgrep -x "sqlservr" > /dev/null; then
    echo "SQL Server is not running. Please start SQL Server service first."
    echo "Run: sudo systemctl start mssql-server"
    exit 1
fi

echo "SQL Server is running."

# Set the path to the SQL files
SCHEMA_FILE="./fixed-complete-schema.sql"
DATA_FILE="./fixed-vietnamese-sample-data.sql"

# Check if files exist
if [ ! -f "$SCHEMA_FILE" ]; then
    echo "Schema file not found: $SCHEMA_FILE"
    exit 1
fi

if [ ! -f "$DATA_FILE" ]; then
    echo "Data file not found: $DATA_FILE"
    exit 1
fi

echo "Files found. Starting import..."

# Import schema
echo "Importing schema..."
sqlcmd -S $SERVER_INSTANCE -U $USERNAME -P $PASSWORD -d $DATABASE -i $SCHEMA_FILE

if [ $? -eq 0 ]; then
    echo "Schema imported successfully!"
else
    echo "Error importing schema. Exit code: $?"
    exit 1
fi

# Import data
echo "Importing sample data..."
sqlcmd -S $SERVER_INSTANCE -U $USERNAME -P $PASSWORD -d $DATABASE -i $DATA_FILE

if [ $? -eq 0 ]; then
    echo "Sample data imported successfully!"
else
    echo "Error importing sample data. Exit code: $?"
    exit 1
fi

# Verify data
echo "Verifying imported data..."
VERIFY_QUERY="SELECT 'Users' as TableName, COUNT(*) as Count FROM Users
UNION ALL
SELECT 'Candidates', COUNT(*) FROM Candidates
UNION ALL
SELECT 'JobPostings', COUNT(*) FROM JobPostings
UNION ALL
SELECT 'Applications', COUNT(*) FROM Applications
UNION ALL
SELECT 'Interviews', COUNT(*) FROM Interviews
UNION ALL
SELECT 'Departments', COUNT(*) FROM Departments;"

sqlcmd -S $SERVER_INSTANCE -U $USERNAME -P $PASSWORD -d $DATABASE -Q "$VERIFY_QUERY"

echo "Import process completed successfully!"
echo "You can now run the HR Management System application."
