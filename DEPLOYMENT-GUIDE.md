# Git, Jenkins, Tomcat, and Render setup

This guide records the remaining machine/account steps for the course deployment units. The Desktop project is already initialized as a local Git repository on the `main` branch. A hosted Git repository, Jenkins server, Tomcat installation, and Render deployment still require setup on your accounts or computer.

## Git repository and child branch

1. Open PowerShell in this project folder.
2. Set your author identity once, using your own name and email:

   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```

3. Save the project as the first commit and create a child branch:

   ```powershell
   git add .
   git commit -m "Initial placement portal project"
   git switch -c feature/deployment-demo
   ```

4. Create an empty repository on your Git hosting account. Connect and push it:

   ```powershell
   git remote add origin https://github.com/YOUR-ACCOUNT/placement-portal-fullstack.git
   git push -u origin main
   git push -u origin feature/deployment-demo
   ```

Replace the example URL with your repository URL. `.env` files, dependencies, build outputs, and uploaded resumes are excluded by `.gitignore`.

## Jenkins on Windows

1. Install/run Jenkins and install the **NodeJS** plugin.
2. In **Manage Jenkins → Tools**, add a NodeJS installation named exactly `Node22`, with Node.js 22 available.
3. Create a **Pipeline** job connected to the hosted Git repository, then choose **Pipeline script from SCM** and set the script path to `Jenkinsfile`.
4. Run **Build Now**. The pipeline installs from lockfiles, checks the backend entry point syntax, and builds the React frontend.

The Jenkins agent must be Windows because this pipeline uses the `bat` step. If your Jenkins agent runs Linux, change those steps to `sh`.

## Tomcat frontend demonstration

Tomcat serves the built React frontend. The Express API must still run separately.

1. Start the backend and MongoDB as described in `README.md`.
2. In PowerShell, build the frontend with the API address that the browser can reach:

   ```powershell
   cd frontend
   $env:VITE_API_URL = "http://localhost:5000/api"
   npm.cmd ci
   npm.cmd run build
   ```

3. Copy the contents of `frontend\dist` into Tomcat's `webapps\placement-portal` folder. Create the destination folder if needed; preserve other Tomcat webapps.
4. Start Tomcat and open `http://localhost:8080/placement-portal/`.

If the API is on another computer, replace `localhost` with that computer's reachable address. Do not use a private laptop URL in a public deployment.

## Render deployment

The root `render.yaml` describes separate API and static frontend services.

1. Push the project to a hosted Git repository and sign in to Render.
2. Create a new **Blueprint** from that repository and select `render.yaml`.
3. Create a MongoDB Atlas database and use its connection string for the API's `MONGODB_URI` setting. Keep `JWT_SECRET` generated privately by Render.
4. After the frontend service is created, set the API's `CLIENT_ORIGIN` to the frontend's Render URL (origin only, without a path).
5. Set the frontend's `VITE_API_URL` to the API's Render URL followed by `/api`, then redeploy the frontend.
6. Open the frontend URL, register or sign in, and exercise the student, drive, and application pages.

Render deployment requires your Render and Atlas accounts. The local app's seeded demo user is created by `npm run seed`; do not assume it exists in Atlas unless you run the seed script against the Atlas database intentionally. Uploaded resumes on Render's default local disk are temporary; use persistent storage before relying on uploaded files.
