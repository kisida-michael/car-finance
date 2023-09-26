@echo off
set DIRECTORY=C:\Users\micha\Projects\car-finance
set FIREBASE_DATA_PATH=C:\Users\micha\Projects\car-finance\Firebase_data

start cmd.exe /K "cd %DIRECTORY% && npm run dev"
start cmd.exe /K "cd %DIRECTORY% && firebase emulators:start --import "%FIREBASE_DATA_PATH%" --export-on-exit "%FIREBASE_DATA_PATH%""
start cmd.exe /K "stripe listen --events invoice.paid --forward-to http://localhost:5001/awautofinancing/us-central1/updateInvoiceStatus"
start code %DIRECTORY%

exit
