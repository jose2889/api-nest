# FROM debian:bullseye as builder

# ARG NODE_VERSION=16.18.1

# RUN apt-get update; apt install -y curl
# RUN curl https://get.volta.sh | bash
# ENV VOLTA_HOME /root/.volta
# ENV PATH /root/.volta/bin:$PATH
# RUN volta install node@${NODE_VERSION}

# #######################################################################

# RUN mkdir /dist
# WORKDIR /dist

# # NPM will not install any package listed in "devDependencies" when NODE_ENV is set to "production",
# # to install all modules: "npm install --production=false".
# # Ref: https://docs.npmjs.com/cli/v9/commands/npm-install#description

# ENV NODE_ENV production

# COPY . .

# RUN npm i && npm run build
# FROM debian:bullseye

# LABEL fly_launch_runtime="nodejs"

# COPY --from=builder /root/.volta /root/.volta
# COPY --from=builder /dist /dist

# WORKDIR /dist
# ENV NODE_ENV production
# ENV PATH /root/.volta/bin:$PATH

# CMD [ "npm", "run", "start:prod" ]




FROM node:16-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci --force

COPY --chown=node:node . .
RUN npm run build 

# ---

FROM node:16-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["node", "dist/main.js"]