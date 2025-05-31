# Use an official Node runtime as a parent image
FROM node:20 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies, forcing legacy peer dependency resolution
RUN npm install --legacy-peer-deps

# Copy the entire project to the working directory
COPY . .

# Build the React app for production
RUN npm run build

# Set the port to 3002 inside the container
ENV PORT=4173

# Expose port 3002 (instead of the default 3000)
EXPOSE 4173

# Command to run the React app
CMD ["npm", "run", "preview"]