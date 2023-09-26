@echo off

:: Send Ctrl+C to the command prompt running stripe listen
cscript //nologo sendCtrlC.vbs "stripe listen --events invoice.paid --forward-to http://localhost:5001/awautofinancing/us-central1/updateInvoiceStatus"

:: Send Ctrl+C to the command prompt running firebase emulators
cscript //nologo sendCtrlC.vbs "firebase emulators:start"

:: Send Ctrl+C to the command prompt running npm run dev
cscript //nologo sendCtrlC.vbs "npm run dev"

:: Close VSCode
taskkill /IM "Code.exe" /F

exit
