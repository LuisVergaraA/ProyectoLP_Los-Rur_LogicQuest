#!/bin/bash

echo "🚀 Instalación Rápida de LogicQuest"
echo "===================================="

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Backend
echo -e "\n${BLUE}📦 Configurando Backend...${NC}"
cd backend

echo "Instalando dependencias de Python..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias de backend instaladas${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias de backend${NC}"
    exit 1
fi

echo "Inicializando base de datos..."
python init_data.py

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Base de datos inicializada${NC}"
else
    echo -e "${RED}❌ Error inicializando base de datos${NC}"
    exit 1
fi

# Frontend
echo -e "\n${BLUE}📦 Configurando Frontend...${NC}"
cd ../logicquest-front

echo "Instalando dependencias de Node.js..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias de frontend instaladas${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias de frontend${NC}"
    exit 1
fi

# Finalización
echo -e "\n${GREEN}✅ ¡Instalación completada!${NC}"
echo ""
echo "Para iniciar el proyecto:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend"
echo "    uvicorn app.main:app --reload"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd logicquest-front"
echo "    npm run dev"
echo ""
echo "🎮 ¡Disfruta LogicQuest!"