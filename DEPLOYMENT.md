# Deployment to Render.com

This project is configured to deploy to Render.com using Docker.

## Render.com Deployment Steps

1. **Create a new Web Service**
2. **Connect your repository** to Render.com
3. **Configure the service**:
   - **Build Command**: `docker build -t bun-react-app .`
   - **Start Command**: `docker run -p $PORT:3000 bun-react-app`
   - **Environment**: `Docker`
   - **Port**: `3000` (or let Render auto-detect)

### Alternative: Direct Build (No Docker)

If you prefer not to use Docker, you can also deploy directly:

1. **Build Command**: `bun install && bun run build`
2. **Start Command**: `bun src/index.tsx`
3. **Environment**: `Node`

## Environment Variables

Set these in Render.com dashboard if needed:
- `PORT`: Port number (Render will set this automatically)
- `NODE_ENV`: Set to `production`

## Local Testing

To test the Docker build locally:

```bash
# Build the image
docker build -t bun-react-app .

# Run the container
docker run -p 3000:3000 bun-react-app
```