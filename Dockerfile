# Etapa 1: Construir la aplicación React
FROM node:18 AS builder

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación React
RUN npm run build

# Etapa 2: Configurar NGINX con variables dinámicas
FROM nginx:alpine

# Instalar bash y gettext para usar envsubst
RUN apk add --no-cache bash gettext

# Copiar la configuración de NGINX
COPY nginx.template.conf /etc/nginx/templates/default.conf.template

# Copiar los archivos estáticos de la app construida
COPY --from=builder /app/build /usr/share/nginx/html

# Establece permisos correctos
RUN chmod -R 755 /usr/share/nginx/html

# Usar envsubst para reemplazar variables de entorno y ejecutar el entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]


# Usar envsubst para reemplazar variables de entorno
CMD ["/bin/bash", "-c", "envsubst < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
