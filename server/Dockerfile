FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY src ./src
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs && mkdir -p /data && chown -R nodeuser:nodejs /data /app
USER nodeuser
ENV NODE_ENV=production
ENV PORT=4000
ENV DB_PATH=/data/habitrace.db
EXPOSE 4000
CMD ["node", "src/index.js"]
