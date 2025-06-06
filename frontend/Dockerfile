FROM node:22.14.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

# 빌드 시점에 ARG 받아서 ENV로 설정
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]