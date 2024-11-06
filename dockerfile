# Stage 1: Build Angular app with a smaller Node.js base image
FROM node:20-alpine AS build

WORKDIR /app

# Copiar solo package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de producción y limpiar caché de npm
RUN npm ci --only=production && npm cache clean --force

# Copiar el resto de los archivos del proyecto
COPY . .

# Compilar la aplicación Angular para producción
RUN npm run build --prod

# Stage 2: Nginx para servir la aplicación
FROM nginx:alpine

# Copiar los archivos de la build de Angular desde el contenedor de construcción
COPY --from=build /app/dist/agro-crypto /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando predeterminado para Nginx
CMD ["nginx", "-g", "daemon off;"]
