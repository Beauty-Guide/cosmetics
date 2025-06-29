# Используем официальный образ Node.js
FROM node:20-alpine

# Указываем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Собираем проект
RUN npm run build

# Запускаем сервер
CMD ["serve", "-s", "build"]

# Открываем порт
EXPOSE 3000