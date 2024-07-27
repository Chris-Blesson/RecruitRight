
# RecruitRight

This is a hackathon project. - [blog url](https://rookiecoderlok.hashnode.dev/revolutionizing-recruitment-an-ai-powered-hackathon-project)


### RecruitRight frontend local setup

We use NextJS for our Frontend. 

- Navigate into the recruitRight directory
- Sign up for Open AI, Clerk, Resend and vercel blob services.
- Provide the secret credentials as mentioned in the `env.sample` file. 
- Run `yarn` or `npm`
- Run `yarn dev` or `npm run dev`
- The service will be up in the port `http://localhost:3000` by default.

### Resume parser service

We use python and fastapi based service for our resume parser. 

- Navigate into resume-parser directory
- Run `pip install` or `pip3 install`
- Run `python3 -m uvicorn main:app --reload`. 
- The service will be up in `http://127.0.0.1:8000` by default.

### Database
We use postgres as our DB

- Install postgres from the official downloads page.
- Run postgres
- Create a DB named `recruitRight`.
- If any other DB name is provided, feel free to update [this](https://github.com/Chris-Blesson/RecruitRight/blob/main/recruit-right/lib/db.ts) file.
- Start the DB.
- For the tables, we have created `createTable` api. [Api code](https://github.com/Chris-Blesson/RecruitRight/blob/main/recruit-right/app/api/create-table/route.ts). This mostly captures all the tables. Else, feel free to add the table name as one of the cases. 

