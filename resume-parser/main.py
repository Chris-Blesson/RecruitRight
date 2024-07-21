from fastapi import FastAPI
import httpx
from pydantic import BaseModel
from docUtils import extractTextFromPdfUrl
from resumeGenerator import generateJsonResume

app = FastAPI()


class ParseResumeRequest(BaseModel):
    account_id: str
    pdf_url: str
    
@app.post("/parse")
async def parseResume(request: ParseResumeRequest):

  #TODO: Change this url to prod
  url = "http://127.0.0.1:3000/api/resume/parse-success"  # Example third-party API URL
  extractedResumeText = await extractTextFromPdfUrl(request.pdf_url)
  openAiModel="gpt-3.5-turbo"
  #TODO: Use api key from env variable
  openAiKey=""
  jsonResume = generateJsonResume(extractedResumeText, openAiKey, openAiModel)

  print(extractedResumeText)
  async with httpx.AsyncClient() as client:
      response = await client.post(url, json={"resumePayload": jsonResume, "account_id":request.account_id})
      response.raise_for_status()
  return {"resume_payload": jsonResume, "account_id":request.account_id};

# python3 -m uvicorn main:app --reload