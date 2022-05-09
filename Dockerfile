# syntax=docker/dockerfile:1.3-labs
FROM node:14

ADD https://github.com/just-containers/s6-overlay/releases/download/v2.2.0.3/s6-overlay-amd64-installer /tmp/
RUN chmod +x /tmp/s6-overlay-amd64-installer && /tmp/s6-overlay-amd64-installer /

WORKDIR /opt/app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 80

COPY <<EOF /etc/cont-init.d
#!/usr/bin/with-contenv sh
cd /opt/app
npm run build
EOF

ENTRYPOINT ["/init"]

CMD ["npm", "run", "start"]
