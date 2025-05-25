@echo off
echo 🚀 Iniciando bot ChatGPT + WhatsApp...

REM 👉 Iniciar Ngrok en puerto 3000 (en nueva ventana)
start "" "C:\Users\PC\Documents\ngrok\ngrok.exe" http 3000

REM 🕐 Esperar 2 segundos para que ngrok arranque
timeout /t 2 >nul

REM 🚗 Navegar a la carpeta del bot
cd /d C:\Repositorio\Vektor

REM ▶️ Ejecutar el bot con npm
call npm start

pause
