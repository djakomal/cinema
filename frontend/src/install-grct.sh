

#!/bin/bash

echo "🎬 Installation de l'application GRCT Cinema..."
echo "================================================"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Créer le projet React
echo -e "${BLUE}📦 Création du projet React...${NC}"
npx create-react-app grct-cinema
cd grct-cinema

# 2. Installer les dépendances React
echo -e "${BLUE}📦 Installation des dépendances React...${NC}"
npm install react-router-dom axios

# 3. Créer la structure des dossiers
echo -e "${BLUE}📁 Création de la structure...${NC}"
mkdir -p src/components
mkdir -p src/pages/Admin
mkdir -p src/styles
mkdir -p src/services

# 4. Télécharger le logo
echo -e "${BLUE}🖼️  Téléchargement du logo...${NC}"
curl -o public/logo-grct.jpg "https://lindy.nyc3.digitaloceanspaces.com/user-content/prod/owners/68dc5ac459457b03ae7cd822/attachments/c282aa46-e053-4052-b957-288697b13180-WhatsApp%20Image%202025-10-21%20%C3%83%C2%A0%2007.31.11_96a2a45e.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=DO00QNZAZRRRMG9PUNE4%2F20251025%2Fnyc3%2Fs3%2Faws4_request&X-Amz-Date=20251025T111212Z&X-Amz-Expires=86400&X-Amz-Signature=c81ea2812a872c3105d0bf5ae658d522d74cdde5d8c97135f7ef328ecdbcacdb&X-Amz-SignedHeaders=host&x-id=GetObject"

# 5. Créer le backend
echo -e "${BLUE}🔧 Création du backend...${NC}"
cd ..
mkdir grct-backend
cd grct-backend
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken multer express-validator
npm install --save-dev nodemon

# Créer la structure backend
mkdir -p config models routes middleware uploads/actors uploads/cvs uploads/videos uploads/thumbnails

echo -e "${GREEN}✅ Installation terminée!${NC}"
echo ""
echo "📝 Prochaines étapes:"
echo "1. Copiez les fichiers de code dans les dossiers appropriés"
echo "2. Configurez le fichier .env dans grct-backend"
echo "3. Lancez MongoDB"
echo "4. Démarrez le backend: cd grct-backend && npm run dev"
echo "5. Démarrez le frontend: cd grct-cinema && npm start"
echo ""
echo "🎬 Votre application GRCT sera accessible sur http://localhost:3000"