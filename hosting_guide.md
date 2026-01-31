# Hosting TaskFlow from Your Local PC

This guide explains how to make your locally running TaskFlow application accessible from the internet.

## 1. Prerequisites

-   **Backend**: Running on `http://localhost:5202`
-   **Frontend**: Running on `http://localhost:5173` (or `http://localhost:3000` per `vite.config.ts`)

## 2. Recommended Method: Cloudflare Tunnels (Recommended)

Cloudflare Tunnels (formerly Argo Tunnel) is the safest and most reliable way to expose your local PC. It doesn't require opening ports on your router.

### Steps:
1.  **Install `cloudflared`**: Download it from [Cloudflare's website](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-run/).
2.  **Authenticate**: Run `cloudflared tunnel login`.
3.  **Create a Tunnel**: Run `cloudflared tunnel create taskflow`.
4.  **Configure Routing**:
    -   You'll need a domain managed by Cloudflare.
    -   Route a subdomain (e.g., `api.yourdomain.com`) to `http://localhost:5202`.
    -   Route another subdomain (e.g., `taskflow.yourdomain.com`) to `http://localhost:3000`.
5.  **Run the Tunnel**: Run `cloudflared tunnel run taskflow`.

## 3. Alternative Method: ngrok (Easiest for Quick Testing)

Ngrok is very simple to set up but the free version changes your URL every time you restart it.

### Steps:
1.  **Install ngrok**: Download from [ngrok.com](https://ngrok.com/).
2.  **Expose Backend**: Open a terminal and run `ngrok http 5202`.
    -   *Note the URL provided (e.g., `https://random-id.ngrok-free.app`).*
3.  **Configure Frontend**:
    -   Create/Edit `TaskFlow.Web/.env`.
    -   Set `VITE_API_URL=https://random-id.ngrok-free.app/api`.
4.  **Expose Frontend**: Open a second terminal and run `ngrok http 3000`.
    -   Use the new URL provided to access your app from anywhere!

## 4. Important Tips

> [!IMPORTANT]
> **CORS**: The backend is already configured to Allow All origins, so you shouldn't run into CORS issues with these tunnels.

> [!WARNING]
> **API URL**: If your tunnel URL changes (like with free ngrok), you **must** update the `VITE_API_URL` in your `.env` file and restart the frontend.

> [!CAUTION]
> **Security**: Only share your public URL with people you trust. Anyone with the URL can access your locally running application and database.
