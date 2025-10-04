# -------- Stage 1: Build the app --------

    FROM node:20-alpine as builder

    WORKDIR /app
    
    COPY package*.json ./
    
    RUN npm ci --omit=dev
    
    COPY . .
    
    # -------- Stage 2: Create minimal image using distroless --------
        
    FROM gcr.io/distroless/nodejs20-debian11:latest
    
    WORKDIR /app
    
    COPY --from=builder /app .
    
    USER root 
    
    EXPOSE 3000
    
    CMD ["app.js"]
    