@echo off
cd /d "%~dp0"
echo Ejecutando limpieza de MongoDB...
node limpiarMongoDB.js
pause
