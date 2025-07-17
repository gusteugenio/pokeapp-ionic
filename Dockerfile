FROM node:20
WORKDIR /app
COPY . .
RUN npm install @ionic/cli -g
EXPOSE 8100
CMD ["ionic", "serve", "--host", "0.0.0.0", "--port", "8100"]
 