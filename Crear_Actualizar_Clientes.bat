@echo off
title Ejecutar script: Crear_Actualizar_Clientes.js

:: Ir a la carpeta donde está el proyecto (ajusta si es necesario)
cd /d %~dp0

:: Ejecutar el script con Node.js
echo Ejecutando Crear_Actualizar_Clientes.js...
node Crear_Actualizar_Clientes.js

echo.
echo ✅ Script finalizado. Presiona una tecla para cerrar.
pause >nul
