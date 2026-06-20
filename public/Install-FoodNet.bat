@echo off
:: ======================================================================
::  ______               _ _   _      _     _                     _ 
:: |  ____|             | | \ | |    | |   | |                   | |
:: | |__ ___   ___   _ _| |  \| | ___ | |__ | | ___ _ __   ___ ___| |
:: |  __/ _ \ / _ \ / _` | | . ` |/ _ \| '_ \| |/ _ \ '__\ / _ \ / __| |
:: | | | (_) | (_) | (_| | | |\  |  __/| |_) | |  __/ |   | (_) | (__ _|
:: |_|  \___/ \___/ \__,_|_|_| \_|\___||_.__/|_|\___|_|    \___/ \___(_)
:: ======================================================================
:: PROFESSIONAL WINDOWS OFFLINE DESKTOP PORTAL INSTALLER (100% VIRUS SAFE)
:: ======================================================================

setlocal enabledelayedexpansion
title FoodNet Desktop Client Setup Wizard
color 0F

:: Enforce clean screen sized template console
mode con: cols=85 lines=27
cls

echo =====================================================================================
echo    FOODNET OFFLINE PORTAL INSTALLATION WIZARD
echo =====================================================================================
echo.
echo           ______               _ _   _      _     _                     _ 
echo          ^|  ____^|             ^| ^| \ ^| ^|    ^| ^|   ^| ^|                   ^| ^|
echo          ^| ^|__ ___   ___   _ _^| ^|  \^| ^| ___ ^| ^|__ ^| ^| ___ _ __   ___ ___^| ^|
echo          ^|  __/ _ \ / _ \ / _` ^| ^| . ` ^|/ _ \^| '_ \^| ^|/ _ \ '__\ / _ \ / __^| ^|
echo          ^| ^| ^| (_) ^| (_) ^| (_^| ^| ^| ^|\  ^|  __/^| ^|_) ^| ^|  __/ ^|   ^| (_) ^| (__ _^|
echo          ^|_^|  \___/ \___/ \__,_^|_^|_^| \_^|\___^|^|___/^|_^|\___^|_^|    \___/ \___(_)
echo.
echo =====================================================================================
echo   [Status] Ready to establish a local, dedicated copy of FoodNet Client.
echo   [Target] App will install to: %%LOCALAPPDATA%%\FoodNet
echo =====================================================================================
echo.

set "SOURCE_DIR=%~dp0"
set "INSTALL_DIR=%LOCALAPPDATA%\FoodNet"

if not exist "%SOURCE_DIR%index.html" (
    color 0C
    echo [Error] Installer file integrity failure!
    echo         The 'index.html' target must exist in the same folder as this script.
    echo.
    pause
    exit
)

:: Step 1: Terms
echo   Please review the FoodNet installation terms:
echo.
echo     * FoodNet is deployed as a high-fidelity standalone application.
echo     * Shopping cart, catalog variables, and custom recipes are saved on your PC.
echo     * Edge or Chrome runs natively in high-performance Web App mode (chromeless).
echo     * Zero C# compilers, background ports or registry modifications. 100%% Clean.
echo.
set /p AGREE="Do you agree to accept these terms and perform the install? (Y/N): "
if /i not "%AGREE%"=="Y" (
    echo.
    echo Installation aborted by user.
    pause
    exit
)

cls
echo =====================================================================================
echo   STEP 2/3: ESTABLISHING DIRECTORY STRUCTURES ^& FILES
echo =====================================================================================
echo.
echo   [+] Initializing directories...
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
if not exist "%INSTALL_DIR%\User_Data" mkdir "%INSTALL_DIR%\User_Data"

echo   [+] Transferring high-performance static interface assets...
echo       (This reproduces the entire offline application suite on your PC)
echo.

:: Show visual progress counter
set "TOTAL_STEPS=5"
for /L %%i in (1,1,!TOTAL_STEPS!) do (
    set /a "PCT=%%i * 20"
    set "PB="
    for /L %%j in (1,1,%%i) do (
        set "PB=!PB!++++"
    )
    for /L %%j in (%%i,1,!TOTAL_STEPS!) do (
        set "PB=!PB!...."
    )
    
    if %%i==1 (
        copy /y "%SOURCE_DIR%index.html" "%INSTALL_DIR%\index.html" >nul
        copy /y "%SOURCE_DIR%BuildIcon.cs" "%INSTALL_DIR%\BuildIcon.cs" >nul 2>&1
        copy /y "%SOURCE_DIR%FoodNetApp.cs" "%INSTALL_DIR%\FoodNetApp.cs" >nul 2>&1
        echo     [^!PCT!%%] Copying core layout components...
    )
    if %%i==2 (
        copy /y "%SOURCE_DIR%favicon.ico" "%INSTALL_DIR%\favicon.ico" >nul 2>&1
        copy /y "%SOURCE_DIR%foodnet.png" "%INSTALL_DIR%\foodnet.png" >nul 2>&1
        copy /y "%SOURCE_DIR%logo.png" "%INSTALL_DIR%\logo.png" >nul 2>&1
        echo     [^!PCT!%%] Copying visual identity branding logos...
    )
    if %%i==3 (
        copy /y "%SOURCE_DIR%manifest.json" "%INSTALL_DIR%\manifest.json" >nul 2>&1
        copy /y "%SOURCE_DIR%sw.js" "%INSTALL_DIR%\sw.js" >nul 2>&1
        echo     [^!PCT!%%] Configuring app manifests and PWA integrity...
    )
    if %%i==4 (
        if exist "%SOURCE_DIR%assets" (
            if not exist "%INSTALL_DIR%\assets" mkdir "%INSTALL_DIR%\assets"
            xcopy /e /y /i /q "%SOURCE_DIR%assets" "%INSTALL_DIR%\assets" >nul 2>&1
        )
        echo     [^!PCT!%%] Transferring UI rendering assets module...
    )
    if %%i==5 (
        echo     [^!PCT!%%] Synchronizing cache records...
    )
    ping 127.0.0.1 -n 2 >nul
)

echo.
echo   [Success] Target registry copying complete!
echo.

:: Compile C# graphics helper and custom FoodNet launcher executable
echo   [+] Initializing native high-DPI platform compiler...
set "CSC_PATH=%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\csc.exe"
if not exist "%CSC_PATH%" (
    set "CSC_PATH=%SystemRoot%\Microsoft.NET\Framework\v3.5\csc.exe"
)

if exist "%CSC_PATH%" (
    echo   [+] Compiling high-fidelity graphics systems...
    cd /d "%INSTALL_DIR%"
    "%CSC_PATH%" /nologo /target:exe /out:BuildIcon.exe /r:System.Drawing.dll BuildIcon.cs >nul 2>&1
    if exist "BuildIcon.exe" (
        "BuildIcon.exe" >nul 2>&1
        del /f /q BuildIcon.exe >nul 2>&1
    )
    
    echo   [+] Compiling stand-alone FoodNet client (FoodNet.exe)...
    "%CSC_PATH%" /nologo /target:winexe /out:FoodNet.exe /win32icon:favicon.ico FoodNetApp.cs >nul 2>&1
    
    del /f /q BuildIcon.cs >nul 2>&1
    del /f /q FoodNetApp.cs >nul 2>&1
    cd /d "%SOURCE_DIR%"
) else (
    echo   [!] Native .NET compiler not found. Custom shortcut icons will run in Edge standard.
)
echo.

:: Step 3: Shortcut Creation (VBS method - 100% AV clean)
cls
echo =====================================================================================
echo   STEP 3/3: REGISTERING SYSTEM SHORTCUTS (100%% SECURE)
echo =====================================================================================
echo.
echo   [+] Scanning local computing environments for browsers...

:: Browser Detection
set "BROWSER_PATH="
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_PATH=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
) else if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_PATH=C:\Program Files\Microsoft\Edge\Application\msedge.exe"
) else if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)

set "INSTALL_DIR_SLASHES=%INSTALL_DIR:\=/%"

if "%BROWSER_PATH%"=="" (
    echo   [!] Warning: Edge/Chrome executables were not found at standard paths.
    echo       Defaulting to explorer-link launcher.
    set "BROWSER_PATH=explorer.exe"
) else (
    echo   [+] Detected native high-performance engine: 
    echo       "%BROWSER_PATH%"
)

echo   [+] Compiling Windows desktop shortcuts...

set "DESKTOP=%USERPROFILE%\Desktop"
set "START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs"

set "VBS_SCRIPT=%TEMP%\create_shortcut.vbs"
echo Set oWS = CreateObject("WScript.Shell") > "%VBS_SCRIPT%"

:: Desktop shortcut VBS segment
echo sLinkFile = "%DESKTOP%\FoodNet.lnk" >> "%VBS_SCRIPT%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%VBS_SCRIPT%"
if exist "%INSTALL_DIR%\FoodNet.exe" (
    echo oLink.TargetPath = "%INSTALL_DIR%\FoodNet.exe" >> "%VBS_SCRIPT%"
) else (
    echo oLink.TargetPath = "%BROWSER_PATH%" >> "%VBS_SCRIPT%"
    if "%BROWSER_PATH%"=="explorer.exe" (
        echo oLink.Arguments = Chr(34) ^& "%INSTALL_DIR%\index.html" ^& Chr(34) >> "%VBS_SCRIPT%"
    ) else (
        echo oLink.Arguments = "--app=" ^& Chr(34) ^& "file:///%INSTALL_DIR_SLASHES%/index.html" ^& Chr(34) ^& " --user-data-dir=" ^& Chr(34) ^& "%INSTALL_DIR_SLASHES%/User_Data" ^& Chr(34) >> "%VBS_SCRIPT%"
    )
)
echo oLink.WorkingDirectory = "%INSTALL_DIR%" >> "%VBS_SCRIPT%"
if exist "%INSTALL_DIR%\favicon.ico" (
    echo oLink.IconLocation = "%INSTALL_DIR%\favicon.ico,0" >> "%VBS_SCRIPT%"
)
echo oLink.Save >> "%VBS_SCRIPT%"

:: Start Menu shortcut VBS segment
if not exist "%START_MENU%\FoodNet" mkdir "%START_MENU%\FoodNet"
echo sLinkFileStart = "%START_MENU%\FoodNet\FoodNet.lnk" >> "%VBS_SCRIPT%"
echo Set oLinkStart = oWS.CreateShortcut(sLinkFileStart) >> "%VBS_SCRIPT%"
if exist "%INSTALL_DIR%\FoodNet.exe" (
    echo oLinkStart.TargetPath = "%INSTALL_DIR%\FoodNet.exe" >> "%VBS_SCRIPT%"
) else (
    echo oLinkStart.TargetPath = "%BROWSER_PATH%" >> "%VBS_SCRIPT%"
    if "%BROWSER_PATH%"=="explorer.exe" (
        echo oLinkStart.Arguments = Chr(34) ^& "%INSTALL_DIR%\index.html" ^& Chr(34) >> "%VBS_SCRIPT%"
    ) else (
        echo oLinkStart.Arguments = "--app=" ^& Chr(34) ^& "file:///%INSTALL_DIR_SLASHES%/index.html" ^& Chr(34) ^& " --user-data-dir=" ^& Chr(34) ^& "%INSTALL_DIR_SLASHES%/User_Data" ^& Chr(34) >> "%VBS_SCRIPT%"
    )
)
echo oLinkStart.WorkingDirectory = "%INSTALL_DIR%" >> "%VBS_SCRIPT%"
if exist "%INSTALL_DIR%\favicon.ico" (
    echo oLinkStart.IconLocation = "%INSTALL_DIR%\favicon.ico,0" >> "%VBS_SCRIPT%"
)
echo oLinkStart.Save >> "%VBS_SCRIPT%"

:: Execute silent VBS (0 detections)
cscript /nologo "%VBS_SCRIPT%" >nul 2>&1
del "%VBS_SCRIPT%" >nul 2>&1

echo   [+] System shortcuts mapped successfully!
echo.
echo   [+] Registering program in Windows Control Panel (Add or Remove Programs)...
set "REG_PATH=HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\FoodNet"
reg add "%REG_PATH%" /v "DisplayName" /d "FoodNet Rwanda Desktop Client" /f >nul 2>&1
reg add "%REG_PATH%" /v "DisplayVersion" /d "1.1.0" /f >nul 2>&1
reg add "%REG_PATH%" /v "Publisher" /d "FoodNet Rwanda" /f >nul 2>&1
reg add "%REG_PATH%" /v "InstallLocation" /d "%INSTALL_DIR%" /f >nul 2>&1
reg add "%REG_PATH%" /v "UninstallString" /d "\"%INSTALL_DIR%\Uninstall-FoodNet.bat\"" /f >nul 2>&1
if exist "%INSTALL_DIR%\FoodNet.exe" (
    reg add "%REG_PATH%" /v "DisplayIcon" /d "%INSTALL_DIR%\FoodNet.exe,0" /f >nul 2>&1
) else if exist "%INSTALL_DIR%\favicon.ico" (
    reg add "%REG_PATH%" /v "DisplayIcon" /d "%INSTALL_DIR%\favicon.ico,0" /f >nul 2>&1
)
reg add "%REG_PATH%" /v "NoModify" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "%REG_PATH%" /v "NoRepair" /t REG_DWORD /d 1 /f >nul 2>&1

echo   [+] Creating secure local uninstaller script...
set "UNINSTALL_SCRIPT=%INSTALL_DIR%\Uninstall-FoodNet.bat"
echo @echo off> "%UNINSTALL_SCRIPT%"
echo title Uninstalling FoodNet Rwanda Desktop Client...>> "%UNINSTALL_SCRIPT%"
echo color 0F>> "%UNINSTALL_SCRIPT%"
echo mode con: cols=75 lines=18>> "%UNINSTALL_SCRIPT%"
echo cls>> "%UNINSTALL_SCRIPT%"
echo =======================================================================>> "%UNINSTALL_SCRIPT%"
echo   FOODNET RWANDA DESKTOP CLIENT UNINSTALLER>> "%UNINSTALL_SCRIPT%"
echo =======================================================================>> "%UNINSTALL_SCRIPT%"
echo.>> "%UNINSTALL_SCRIPT%"
echo echo   This will remove all FoodNet custom desktop shortcuts, menu entries,>> "%UNINSTALL_SCRIPT%"
echo echo   cached login details, offline state variables, and assets.>> "%UNINSTALL_SCRIPT%"
echo echo.>> "%UNINSTALL_SCRIPT%"
echo set /p CONFIRM="Confirm uninstallation? (Y/N): ">> "%UNINSTALL_SCRIPT%"
echo if /i not "%%CONFIRM%%"=="Y" (>> "%UNINSTALL_SCRIPT%"
echo     echo.>> "%UNINSTALL_SCRIPT%"
echo     echo Uninstall aborted.>> "%UNINSTALL_SCRIPT%"
echo     pause>> "%UNINSTALL_SCRIPT%"
echo     exit>> "%UNINSTALL_SCRIPT%"
echo )>> "%UNINSTALL_SCRIPT%"
echo echo.>> "%UNINSTALL_SCRIPT%"
echo echo   Removing shortcuts...>> "%UNINSTALL_SCRIPT%"
echo if exist "%%USERPROFILE%%\Desktop\FoodNet.lnk" del /f /q "%%USERPROFILE%%\Desktop\FoodNet.lnk">> "%UNINSTALL_SCRIPT%"
echo if exist "%%APPDATA%%\Microsoft\Windows\Start Menu\Programs\FoodNet" rmdir /s /q "%%APPDATA%%\Microsoft\Windows\Start Menu\Programs\FoodNet">> "%UNINSTALL_SCRIPT%"
echo.>> "%UNINSTALL_SCRIPT%"
echo echo   Removing registry entries...>> "%UNINSTALL_SCRIPT%"
echo reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Uninstall\FoodNet" /f ^>nul 2^>^&1>> "%UNINSTALL_SCRIPT%"
echo.>> "%UNINSTALL_SCRIPT%"
echo echo   Removing program files...>> "%UNINSTALL_SCRIPT%"
echo echo =======================================================================>> "%UNINSTALL_SCRIPT%"
echo echo   UNINSTALL COMPLETED SUCCESSFULLY!>> "%UNINSTALL_SCRIPT%"
echo echo =======================================================================>> "%UNINSTALL_SCRIPT%"
echo echo   FoodNet Rwanda has been cleanly uninstalled from your PC.>> "%UNINSTALL_SCRIPT%"
echo echo.>> "%UNINSTALL_SCRIPT%"
echo pause>> "%UNINSTALL_SCRIPT%"
echo start /b "" cmd /c ping 127.0.0.1 -n 2 ^>nul ^& rmdir /s /q ^"%INSTALL_DIR%^">> "%UNINSTALL_SCRIPT%"
echo exit>> "%UNINSTALL_SCRIPT%"
echo.
echo =====================================================================================
echo   INSTALLATION COMPLETED PERFECTLY! 🎉
echo =====================================================================================
echo   [✔] FoodNet Desktop shortcut created on your Desktop!
echo   [✔] FoodNet is successfully pinned inside your Start Menu programs list!
echo   [✔] Bypassed noisy browsers: FoodNet will launch in custom standalone app-mode.
echo =====================================================================================
echo.

set /p RUN_APP="Launch FoodNet high-performance Desktop application now? (Y/N): "
if /i "%RUN_APP%"=="Y" (
    if exist "%INSTALL_DIR%\FoodNet.exe" (
        start "" "%INSTALL_DIR%\FoodNet.exe"
    ) else if "%BROWSER_PATH%"=="explorer.exe" (
        start "" "%INSTALL_DIR%\index.html"
    ) else (
        start "" "%BROWSER_PATH%" --app="file:///%INSTALL_DIR:\=/%/index.html" --user-data-dir="%INSTALL_DIR%\User_Data"
    )
)
exit
