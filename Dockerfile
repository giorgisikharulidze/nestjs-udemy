# NestJS-ის ბაზა
FROM node:20

# სამუშაო დირექტორიის შექმნა
WORKDIR /app

# Copy package.json და yarn.lock (ან package-lock.json)
COPY package.json package-lock.json ./
RUN npm ci
# დამოკიდებულებების დაყენება
RUN yarn install --frozen-lockfile

# პროექტის ფაილების კოპირება
COPY . .

# NestJS-ის კომპილაცია
RUN yarn build

# API-ის გაშვების ბრძანება
CMD ["yarn", "start:prod"]


