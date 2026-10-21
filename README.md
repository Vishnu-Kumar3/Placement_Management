# Placement Portal — Full Stack course project

This is the placement management project rebuilt as a responsive full stack web application: React + Vite frontend, Node.js + Express REST API, and MongoDB. It covers the deliverables listed in the supplied syllabus. The syllabus describes course outcomes and labs, but does not provide a separate marks-by-rubric project sheet.

## Syllabus coverage

| Syllabus area | Project evidence |
|---|---|
| HTML, forms, CSS, responsive design | Semantic React page structure, form validation, Grid/Flexbox and mobile breakpoints in `frontend/src/`. |
| JavaScript, DOM, secure input handling | React state and event handlers; validation and server-side sanitization; user content rendered as text. |
| React | Reusable components, hooks, route protection and login state. |
| Node.js / Express | REST API, URL routing, events, file system upload handling and email automation hook. |
| MongoDB | Mongoose models, CRUD endpoints, references, status history and aggregation dashboard. `User.studentProfile` is a unique one-to-one link; `Application` records form the many-to-many link between students and drives. |
| Postman | Import `postman/Placement-Portal.postman_collection.json` and use the documented variables. |
| Login and registration | JWT authentication with bcrypt-hashed passwords and protected write routes. |
| Git / Jenkins | The Desktop copy is initialized as a local Git repository. `Jenkinsfile` installs locked dependencies, checks backend syntax, and builds the frontend. Jenkins setup and hosted Git steps are in `DEPLOYMENT-GUIDE.md`. |
| Tomcat | The React frontend can be built and copied into Tomcat `webapps/placement-portal`; the Express API remains a separate service. See `DEPLOYMENT-GUIDE.md`. |
| Render | `render.yaml` describes the API and static frontend services. Atlas, Render account settings, and the live deployment must still be configured by the project owner. Steps are in `DEPLOYMENT-GUIDE.md`. |

## Requirements

- Node.js 20.19+ (or 22.12+) and npm; Vite 7 requires one of these supported Node.js lines.
- MongoDB local installation or MongoDB Atlas
- Git; Postman for API demonstration
- For the Tomcat lab: Apache Tomcat 8 or later

## Run locally

1. Start MongoDB, or create an Atlas database and allow your IP in Atlas Network Access.
2. In `backend`, copy `.env.example` to `.env`; set `MONGODB_URI`, `JWT_SECRET`, and allowed frontend origin. Keep secrets private.
3. In a terminal, install and start the API:

   ```text
   cd backend
   npm install
   npm run seed
   npm run dev
   ```

   The API runs at `http://localhost:5000`. Seeded coordinator login: `faculty@placement.demo` / `PlacementDemo123!`. Seeded student login: `aarav.student@placement.demo` / `PlacementStudent123!`. Change demo passwords before any public deployment.
4. In a second terminal, set up the frontend:

   ```text
   cd frontend
   npm install
   ```

   Create `frontend/.env` with `VITE_API_URL=http://localhost:5000/api`, then run `npm run dev` and open the local URL Vite prints.

For the separate Node core HTTP lab, run `cd backend && npm run http-demo` in another terminal and open `http://localhost:5001/api/hello?name=Aarav`.

## Main demonstration

1. Log in with the seeded demo account.
2. Show the dashboard summary and the Drives, Students, and Applications pages.
3. In **Students**, add a student, edit their academic details, then delete only the record created for the demo. Students with applications are protected from deletion.
4. In **Placement drives**, add a drive, edit its status or eligibility, then delete only the record created for the demo. Drives with applications are protected from deletion.
5. Create an application for an eligible student and open drive. The API validates drive status, CGPA/backlogs and duplicate application rules.
6. Update the application's status, then delete only the application created for the demo.
7. Show the uploaded resume is stored and the status history is returned with each application.
8. In Postman, demonstrate GET/POST/PATCH/DELETE endpoints. Use `POST /api/auth/login`, copy the token, set `{{token}}`, and use the collection requests.
9. Show the company placement summary API to demonstrate MongoDB aggregation.
10. Show `Jenkinsfile`, configure a Git repository and Jenkins Pipeline job, and run the pipeline using `DEPLOYMENT-GUIDE.md`.

## File upload and email

The resume endpoint uses Multer, Node's file system, file size/type checks, and an event emitter for upload logging. Local uploads go into `backend/uploads`. Configure SMTP environment values to enable application status emails; without SMTP settings, the app still works and logs that email is not configured. Render's local disk is ephemeral, so use persistent object storage for resumes in a production deployment.

## Tomcat and Render deployment

See `DEPLOYMENT-GUIDE.md` for Windows-specific Git/Jenkins setup, building and copying the frontend to Tomcat, and configuring the Render Blueprint with Atlas. Never commit `.env` files or real credentials. A live Render deployment is not included until the project owner connects their accounts and sets the private environment values.

## Project structure

```text
backend/   Express API, models, auth, validation, uploads, seed script
frontend/  React application and responsive CSS
postman/   Importable API collection
Jenkinsfile
render.yaml
DEPLOYMENT-GUIDE.md
```
