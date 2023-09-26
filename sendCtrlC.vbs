Set WshShell = WScript.CreateObject("WScript.Shell")
WshShell.AppActivate WScript.Arguments(0)
WScript.Sleep 500
WshShell.SendKeys "^C"
WScript.Sleep 500
