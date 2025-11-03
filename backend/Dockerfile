# Dockerfile pour le déploiement
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./
COPY prisma ./prisma/

# Installer TOUTES les dépendances (dev incluses pour la build)
RUN npm ci

# Copier le code source
COPY . .

# Construire l'application
RUN npm run build

# Générer Prisma Client
RUN npx prisma generate

# Nettoyer les devDependencies après la build
RUN npm prune --production

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]