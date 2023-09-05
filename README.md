## Intro

This is a Next + Reactjs scheduling app, using a work-inprogress [design system](https://www.npmjs.com/package/@celoco-ui/react) created from scratch. It uses next api routes to deal with backend requests, and assumes a postgres database is available for connection.
<br />
<img src="https://i.ibb.co/fxH9PxZ/Screenshot-2023-09-05-at-10-47-58.jpg" alt="Landing page" width="320" height="280"/>
<img src="https://i.ibb.co/CVJxhmD/Screenshot-2023-09-05-at-10-48-55.jpg" alt="Registration step 1" width="320" height="280"/>
<img src="https://i.ibb.co/Hn24262/Screenshot-2023-09-05-at-10-49-08.jpg" alt="Registration step 2" width="320" height="280"/>
<img src="https://i.ibb.co/vJk9Npx/Screenshot-2023-09-05-at-10-49-19.jpg" alt="Registration step 3" width="320" height="280"/> 
<img src="https://i.ibb.co/X3rhx0p/Screenshot-2023-09-05-at-10-52-40.jpg" alt="Scheduling page" width="320" height="280"/>
<img src="https://i.ibb.co/bHnSMgn/Screenshot-2023-09-05-at-10-55-04.jpg" alt="Google Calendar event created" width="320" height="280"/>


## Deployment

This app has been deployed @
[https://calme-mu.vercel.app](https://calme-mu.vercel.app) <br />

## Running locally

To run this project locally, you will need to do the following steps in the project root directory:

1. Run `npm install`
2. Add environment variables as suggested in the `.env.example` file  
2.1 Create a google app at [https://console.cloud.google.com/](https://console.cloud.google.com/)
2.2 Generate a [NEXT_AUTH_SECRET](https://next-auth.js.org/configuration/options#nextauth_secret)
2.3 Have a postgres database available. You can do this on any DB manager (e.g. DBeaver, PG Admin) or spin up a database through docker. If you choose docker, the base image `bitnami/postgresql:latest` is recommended
3. Run `npx prisma migrate dev`  
3.1 Check if the local db is correctly set up by running `npx prisma studio`, and seeing that tables are created (e.g. Users)
4. Run `npm run dev`
5. Access http://localhost:3000/ on your browser