@echo off
REM Определяем папку build/server рядом со скриптом
set "BUILD_DIR=%~dp0build\server"

REM Проверяем, что папка существует
if not exist "%BUILD_DIR%" (
    echo [Ошибка] Папка "%BUILD_DIR%" не найдена.
    pause
    exit /b 1
)

REM Переходим в папку
cd /d "%BUILD_DIR%" || (
    echo [Ошибка] Не удалось перейти в "%BUILD_DIR%".
    pause
    exit /b 1
)

REM Устанавливаем зависимости
echo Installing dependencies...
call npm install
call :checkError "npm install"

REM Запускаем сервер в новом окне
start "Serve Server" cmd /k "node server.js"
if errorlevel 1 (
    echo [Ошибка] Не удалось запустить сервер.
    pause
    exit /b 1
)

REM Ждём 3 секунды для старта сервера
timeout /t 3 /nobreak >nul

REM Определяем путь к Chrome
set "USER_DATA_DIR=%~dp0user_data"
set "CHROME_PATH=%ProgramFiles%\Google\Chrome\Application\chrome.exe"

if not exist "%CHROME_PATH%" (
    echo [Ошибка] Chrome не найден по пути "%CHROME_PATH%".
    pause
    exit /b 1
)

REM Открываем Chrome в app-режиме без CORS и без пауз
start "" "%CHROME_PATH%" ^
  --disable-popup-blocking ^
  --disable-infobars ^
  --disable-web-security ^
  --allow-file-access-from-files ^
  --user-data-dir="%USER_DATA_DIR%" ^
  --autoplay-policy=no-user-gesture-required ^
  --app="http://localhost:3002/" ^
  --start-fullscreen ^
  --kiosk ^
@REM   --new-window

if errorlevel 1 (
    echo [Ошибка] Не удалось запустить Chrome.
    pause
    exit /b 1
)

REM Ждём 15 секунд и завершаем explorer.exe
timeout /t 15 /nobreak >nul
taskkill /f /im explorer.exe
if errorlevel 1 (
    echo [Ошибка] Не удалось завершить explorer.exe.
    pause
    exit /b 1
)

pause
exit /b 0

REM ----------------------------------------------------------------------------
:checkError
REM %~1 — это описание команды (например, "npm install")
if errorlevel 1 (
    echo [Ошибка] Возникла проблема при выполнении %~1.
    pause
    exit /b 1
)
goto :eof

