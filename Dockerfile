# Build stage
FROM node:20.11.1 as build

WORKDIR /app

# Configurar npm para paquetes públicos
RUN npm config set registry http://registry.npmjs.org/ && \
    npm config set strict-ssl false && \
    npm config set access public

# Instalar dependencias
COPY package*.json ./
RUN npm install --no-package-lock --no-save

# Copiar el resto de archivos
COPY . .

# Construir la aplicación
RUN npm run build

# Production stage
FROM nginx:1.24-alpine

# Copiar la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos de build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]