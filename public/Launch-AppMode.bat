@echo off
:: ======================================================================
:: FOODNET COMPACT REVOLUTIONARY PORTABLE DESKTOP LAUNCHER
:: ======================================================================
:: Launches FoodNet instantly in dedicated, chromeless application mode!

title Launching FoodNet Client...
cls

set "TARGET=%~dp0index.html"
set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "CHROME_X85=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
set "EDGE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

echo Launching FoodNet Client system window...

if exist "%CHROME%" (
    start "" "%CHROME%" --app="file:///%TARGET:\=/%"
) else if exist "%CHROME_X85%" (
    start "" "%CHROME_X85%" --app="file:///%TARGET:\=/%"
) else if exist "%EDGE%" (
    start "" "%EDGE%" --app="file:///%TARGET:\=/%"
) else (
    start "" "%TARGET%"
)
exit
