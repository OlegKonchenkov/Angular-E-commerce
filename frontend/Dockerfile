# stage 1
FROM node:12.7-alpine as node
# copy the package.json to install dependencies
COPY package.json package-lock.json ./
# Install the dependencies and make the folder
RUN npm install && mkdir /app-ui && mv ./node_modules ./app-ui

WORKDIR /app-ui

COPY . .

# Build the project and copy the files
RUN npm run ng build --prod

# # stage 2
FROM nginx:1.17.1-alpine
COPY --from=node /app-ui/dist/frontend /usr/share/nginx/html