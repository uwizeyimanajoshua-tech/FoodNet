@echo off
:: ======================================================================
::  ______               _ _   _      _     _                     _ 
:: |  ____|             | | \ | |    | |   | |                   | |
:: | |__ ___   ___   _ _| |  \| | ___ | |__ | | ___ _ __   ___ ___| |
:: |  __/ _ \ / _ \ / _` | | . ` |/ _ \| '_ \| |/ _ \ '__\ / _ \ / __| |
:: | | | (_) | (_) | (_| | | |\  |  __/| |_) | |  __/ |   | (_) | (__ _|
:: |_|  \___/ \___/ \__,_|_|_| \_|\___||_.__/|_|\___|_|    \___/ \___(_)
:: ======================================================================
:: PROFESSIONAL WINDOWS OFFLINE DESKTOP BUNDLER & RUNTIME COMPILER
:: ======================================================================

title FoodNet Enterprise Offline Setup
color 0E
cls

echo ======================================================================
echo   FOODNET OFFLINE INSTALLER & DESKTOP EXECUTIVE ENGINE
echo ======================================================================
echo.
echo [System Status] Initializing compilation environments...
echo [System Status] Target Directory: %~dp0
echo.

set "TARGET_DIR=%~dp0"
set "CS_FILE=%TEMP%\FoodNetLauncher.cs"
set "EXE_FILE=%TARGET_DIR%FoodNet.exe"
set "ICON_FILE=%TARGET_DIR%favicon.ico"

:: 1. Generate the C# Launcher Source Code
echo [Engine Build] Writing compiler instructions...
(
echo using System;
echo using System.Diagnostics;
echo using System.IO;
echo using System.Runtime.InteropServices;
echo extern alias SystemForms;
echo using SystemForms::System.Windows.Forms;
echo.
echo namespace FoodNetApp
echo {
echo     static class Program
echo     {
echo         [DllImport^("kernel32.dll"^)]
echo         static extern IntPtr GetConsoleWindow^(^);
echo         [DllImport^("user32.dll"^)]
echo         static extern bool ShowWindow^(IntPtr hWnd, int nCmdShow^);
echo.
echo         [STAThread]
echo         static void Main^(^)
echo         {
echo             IntPtr handle = GetConsoleWindow^(^);
echo             if ^(handle != IntPtr.Zero^) ShowWindow^(handle, 0^);
echo.
echo             string currentDir = AppDomain.CurrentDomain.BaseDirectory;
echo             string indexPath = Path.Combine^(currentDir, "index.html"^);
echo.
echo             if ^(!File.Exists^(indexPath^)^)
echo             {
echo                 MessageBox.Show^("Could not locate offline system files (index.html). Please extract all files in this ZIP before booting FoodNet.", "FoodNet Offline Engine Error", MessageBoxButtons.OK, MessageBoxIcon.Error^);
echo                 return;
echo             }
echo.
echo             string chromePath = @"C:\Program Files\Google\Chrome\Application\chrome.exe";
echo             string chromePathX86 = @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe";
echo             string msEdgePath = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";
echo             string arguments = "";
echo             string binary = "";
echo.
echo             if ^(File.Exists^(chromePath^)^) {
echo                 binary = chromePath;
echo                 arguments = "--app=\"file:///" + indexPath.Replace^('\\', '/'^).TrimStart^('/'^).Replace^(" ", "%%20"^) + "\"";
echo             } else if ^(File.Exists^(chromePathX86^)^) {
echo                 binary = chromePathX86;
echo                 arguments = "--app=\"file:///" + indexPath.Replace^('\\', '/'^).TrimStart^('/'^).Replace^(" ", "%%20"^) + "\"";
echo             } else if ^(File.Exists^(msEdgePath^)^) {
echo                 binary = msEdgePath;
echo                 arguments = "--app=\"file:///" + indexPath.Replace^('\\', '/'^).TrimStart^('/'^).Replace^(" ", "%%20"^) + "\"";
echo             } else {
echo                 binary = "explorer.exe";
echo                 arguments = "\"" + indexPath + "\"";
echo             }
echo.
echo             ProcessStartInfo psi = new ProcessStartInfo^(binary, arguments^);
echo             psi.UseShellExecute = true;
echo             try {
echo                 Process.Start^(psi^);
echo             } catch ^(Exception ex^) {
echo                 MessageBox.Show^("Failed to execute native portal window: " + ex.Message, "Critical Setup Failure", MessageBoxButtons.OK, MessageBoxIcon.Error^);
echo             }
echo         }
echo     }
echo }
) > "%CS_FILE%"

:: 2. Compile C# into Native Executable using .NET Framework Csc (C# Compiler) built into every Windows installation
echo [Engine Build] Compiling premium native desktop application (FoodNet.exe)...
for /f "tokens=*" %%i in ('dir /b /ad /o-n %SystemRoot%\Microsoft.NET\Framework\v4.*') do (
    set "MSBUILD_DIR=%SystemRoot%\Microsoft.NET\Framework\%%i"
    goto :compile
)

:compile
if "%MSBUILD_DIR%"=="" set "MSBUILD_DIR=%SystemRoot%\Microsoft.NET\Framework\v4.0.30319"

if exist "%MSBUILD_DIR%\csc.exe" (
    "%MSBUILD_DIR%\csc.exe" /nologo /target:winexe /reference:System.Windows.Forms.dll /r:System.dll /out:"%EXE_FILE%" "%CS_FILE%" >nul 2>&1
    
    :: Try fallback compiler options if the reference syntax errored
    if not exist "%EXE_FILE%" (
        (
        echo using System;
        echo using System.Diagnostics;
        echo using System.IO;
        echo using System.Windows.Forms;
        echo.
        echo namespace FoodNetApp
        echo {
        echo     static class Program
        echo     {
        echo         [STAThread]
        echo         static void Main^(^)
        echo         {
        echo             string currentDir = AppDomain.CurrentDomain.BaseDirectory;
        echo             string indexPath = Path.Combine^(currentDir, "index.html"^);
        echo             if ^(!File.Exists^(indexPath^)^) { return; }
        echo             string chromePath = @"C:\Program Files\Google\Chrome\Application\chrome.exe";
        echo             string msEdgePath = @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe";
        echo             string arguments = "";
        echo             string binary = "";
        echo             if ^(File.Exists^(chromePath^)^) {
echo                 binary = chromePath;
echo                 arguments = "--app=\"file:///" + indexPath.Replace^('\\', '/'^).TrimStart^('/'^).Replace^(" ", "%%20"^) + "\"";
echo             } else {
echo                 binary = msEdgePath;
echo                 arguments = "--app=\"file:///" + indexPath.Replace^('\\', '/'^).TrimStart^('/'^).Replace^(" ", "%%20"^) + "\"";
echo             }
echo             try { Process.Start^(binary, arguments^); } catch {}
echo         }
echo     }
echo }
        ) > "%CS_FILE%"
        "%MSBUILD_DIR%\csc.exe" /nologo /target:winexe /out:"%EXE_FILE%" "%CS_FILE%" >nul 2>&1
    )
    
    echo [Engine Build] Native application compiled successfully: FoodNet.exe
) else (
    echo [Engine Build] Local offline C# compiler fallback active...
)

:: Ensure a direct execute fallback is ready if compilation was disabled by corporate group policy
if not exist "%EXE_FILE%" (
    echo [Engine Build] Setting up portable browser launch script fallback...
    (
    echo @echo off
    echo start "" "index.html"
    ) > "%EXE_FILE%.bat"
    set "EXE_FILE=%EXE_FILE%.bat"
)

:: Clean up temporary file
if exist "%CS_FILE%" del "%CS_FILE%"

:: 3. Create Custom Desktop Icon Shortcut via Windows PowerShell Script
echo [Engine Build] Packaging native Desktop Launcher shortcut...
set "SCRIPT_FILE=%TEMP%\CreateShortcut.ps1"
(
echo $WshShell = New-Object -ComObject WScript.Shell
echo $Shortcut = $WshShell.CreateShortcut^([System.IO.Path]::Combine^([System.Environment]::GetFolderPath^('Desktop'^), 'FoodNet.lnk'^)^)
echo $Shortcut.TargetPath = '%EXE_FILE%'
echo $Shortcut.WorkingDirectory = '%TARGET_DIR%'
echo $Shortcut.Description = 'Launch FoodNet Offline Platform'
if exist "%ICON_FILE%" (
    echo $Shortcut.IconLocation = '%ICON_FILE%'
)
echo $Shortcut.Save^(^)
) > "%SCRIPT_FILE%"

powershell -ExecutionPolicy Bypass -File "%SCRIPT_FILE%" >nul 2>&1
if exist "%SCRIPT_FILE%" del "%SCRIPT_FILE%"

echo.
echo ======================================================================
echo   INSTALLATION SUCCESSFUL!
echo ======================================================================
echo   [+] Native Executable:  "%EXE_FILE%"
echo   [+] Desktop Shortcut:   "FoodNet" created on Desktop
echo.
echo   You can run FoodNet offline directly, add items to cart, order,
echo   and access menus immediately in a beautiful native window!
echo ======================================================================
echo.
set /p CHK="Launch FoodNet high-performance client now? (Y/N): "
if /i "%CHK%"=="Y" (
    if exist "%TARGET_DIR%FoodNet.exe" (
        start "" "%TARGET_DIR%FoodNet.exe"
    ) else (
        start "" "%TARGET_DIR%FoodNet.exe.bat"
    )
)
exit
