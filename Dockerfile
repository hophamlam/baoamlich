# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the desired port (replace 3000 with your app's port if necessary)
# EXPOSE 3000

# Start the Node.js application
CMD ["npm", "start"]
