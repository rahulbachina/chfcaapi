# Azure Deployment: Simple VS Code Method

Since you are using VS Code on the Client's VM, the easiest way to deploy is using the **Azure Resources** extension. No complex commands needed!

## 1. Install the Azure Extension
1. In VS Code, click the **Extensions** icon (or press `Ctrl+Shift+X`).
2. Search for and install: **"Azure Resources"** (by Microsoft).
3. Click the **Azure icon** that appears in the left sidebar and **Sign In**.

---

## 2. Deploy the API (Point & Click)

### Step A: Create the Web App
1. In the VS Code Azure sidebar, expand **Resources**.
2. Click the **+** (Plus) icon and select **Create App Service Web App...**.
3. Follow the prompts at the top:
   - **Name**: e.g., `ardonagh-fca-api`
   - **Runtime**: `Python 3.11`
   - **Pricing Tier**: `Basic (B1)` or `Free (F1)` for testing.

### Step B: Deploy the Code
1. **Right-click** on your `backend` folder in the VS Code Explorer.
2. Select **"Deploy to Web App..."**.
3. Choose the app you just created.
4. Click **Deploy** in the popup. 

---

## 3. Set Your API Keys (Securely)
You don't need a `.env` file on Azure. Do this instead:
1. In the VS Code Azure sidebar, find your Web App.
2. Expand **Application Settings**.
3. Right-click and select **Add New Setting...** for each:
   - `FCA_EMAIL`
   - `FCA_KEY`
   - `COMPANIES_HOUSE_API_KEY`
4. Paste your values there. **Azure will restart the app automatically.**

---

## 4. That's It!
Your API is now live at `https://<your-app-name>.azurewebsites.net`.
- Go to `https://<your-app-name>.azurewebsites.net/docs` to see the Swagger UI.
- Your Logic Apps can now call these endpoints!
