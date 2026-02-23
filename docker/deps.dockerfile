FROM base

COPY package.json package-lock.json ./
RUN npm ci