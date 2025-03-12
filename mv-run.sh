#!/bin/bash

set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use
npm run dev &  # Ejecutar en segundo plano

sleep 2  # Pequeña pausa para asegurar que Vite inicie

open http://localhost:5173/  # Abrir en el navegador automáticamente
