FROM node:18.12
LABEL "author"="University of Southampton"

WORKDIR /sl
COPY . .

RUN npm install && npm i ts-node && apt-get update && apt-get -y install jq
RUN chmod +x scripts/*.sh
RUN scripts/env-docker.sh

EXPOSE 6011 6012

CMD ["scripts/setup.sh"]
