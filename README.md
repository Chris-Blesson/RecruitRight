
# RecruitRight

This is a hackathon project.


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
