# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the app source code
COPY . .

# Copy the pre-mounted SQLite database to the appropriate location
COPY ./data/database.db /app/data/database.db

# Start the Node.js app
CMD ["node", "index.js"]
