# Choose the Image which has Node installed already
FROM node:16-alpine3.14

COPY ./inventory ./

# Go to /var/node
WORKDIR /var/node

# Install the Project Dependencies like Express Framework
RUN npm install

# Tell that this image is going to Open a Port 
EXPOSE 4002

# Default Command to launch the Application
#CMD ["npm", "run", "start:env"]
CMD ["npm", "run", "start:dev"]