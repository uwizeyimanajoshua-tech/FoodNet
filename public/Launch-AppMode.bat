@echo off
:: ======================================================================
:: FOODNET PORTABLE APP-MODE EXECUTION WRAPPER
:: ======================================================================
:: Launches FoodNet instantly in standalone, chromeless application mode!
:: Bypasses standard browser frames, URL bars, tabs, and security alerts.

setlocal enabledelayedexpansion
title Launching FoodNet Client...
mode con: cols=65 lines=10
color 0E
cls

echo =================================================================
echo   FOODNET PORTABLE APP-MODE LAUNCHER
echo =================================================================
echo.

set "SOURCE_DIR=%~dp0"
cd /d "%SOURCE_DIR%"

:: Check if FoodNet.exe already exists, if not try to compile it natively offfline
if not exist "FoodNet.exe" (
    if exist "FoodNetApp.cs" (
        echo   [+] Initializing native client compilers...
        set "CSC_PATH=%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\csc.exe"
        if not exist "!CSC_PATH!" (
            set "CSC_PATH=%SystemRoot%\Microsoft.NET\Framework\v3.5\csc.exe"
        )
        if exist "!CSC_PATH!" (
            echo   [+] Rescaling branding vector logos to high-DPI...
            "!CSC_PATH!" /nologo /target:exe /out:BuildIcon.exe /r:System.Drawing.dll BuildIcon.cs >nul 2>&1
            if exist "BuildIcon.exe" (
                "BuildIcon.exe" >nul 2>&1
                del /f /q BuildIcon.exe >nul 2>&1
            )
            echo   [+] Compiling stand-alone FoodNet.exe executable...
            "!CSC_PATH!" /nologo /target:winexe /out:FoodNet.exe /win32icon:favicon.ico FoodNetApp.cs >nul 2>&1
            
            del /f /q BuildIcon.cs >nul 2>&1
            del /f /q FoodNetApp.cs >nul 2>&1
        )
    )
)

if exist "FoodNet.exe" (
    echo   [+] Running standalone FoodNet client portal...
    ping 127.0.0.1 -n 2 >nul
    start "" "FoodNet.exe"
    exit
)

:: Fail-safe fallback: Locate Edge or Chrome and run in standard file app mode
echo   [+] Locating high-performance rendering engine...

set "TARGET=%~dp0index.html"
set "USER_DATA=%~dp0User_Data"

:: Search Chrome & Edge standard paths
set "BROWSER="
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
) else if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER=C:\Program Files\Microsoft\Edge\Application\msedge.exe"
) else if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "BROWSER=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "BROWSER=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

if "%BROWSER%"=="" (
    echo   [!] System-specific browser not found at standard path.
    echo       Launching in your standard default browser...
    ping 127.0.0.1 -n 2 >nul
    start "" "%TARGET%"
) else (
    echo   [+] Edge/Chrome found! Booting in borderless App Window...
    ping 127.0.0.1 -n 2 >nul
    start "" "%BROWSER%" --app="file:///%TARGET:\=/%" --user-data-dir="%USER_DATA%"
)

exit
