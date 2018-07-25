FROM node:8.9 as node

WORKDIR /usr/ng-app/
RUN npm install pm2 -g
RUN git clone https://github.com/Evolvus/evolvus-docket-ng-ui.git

WORKDIR /usr/ng-app/evolvus-docket-ng-ui/
RUN npm install -g @angular/cli typescript uws
RUN npm  i --save
RUN ng build --prod --build-optimizer


WORKDIR /usr/ng-app/
COPY package*.json ./
COPY .npmrc ./
RUN npm install --only=production

COPY . .

RUN cp /usr/ng-app/evolvus-docket-ng-ui/dist/*.* /usr/ng-app/public

#default environment variables
ENV NODE_ENV production
ENV PORT 8085
EXPOSE 8085
CMD ["pm2-runtime", "npm", "--", "start","-i max"]
