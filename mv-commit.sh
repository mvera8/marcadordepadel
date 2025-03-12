#!/bin/bash

set -e

# Obtener el nombre de la rama actual
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

echo "BRANCH NAME: $BRANCH_NAME"

git add .
git status
git commit -m "$BRANCH_NAME"
git push origin HEAD

# Matar cualquier proceso de Vite
pkill -f vite
