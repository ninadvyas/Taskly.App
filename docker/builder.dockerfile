FROM deps

COPY . .
RUN npx prisma generate
RUN npm run build