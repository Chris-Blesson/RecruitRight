from fastapi import FastAPI, File, Form, UploadFile
from docUtils import extractTextFromPdf
from resumeGenerator import generateJsonResume

app = FastAPI()

@app.post("/parse")
async def parseResume( account_id: int = Form(...), file: UploadFile=File(...)):

  extractedResumeText = await extractTextFromPdf(file)
  openAiModel="gpt-3.5-turbo"
  #TODO: Use api key from env variable
  openAiKey=""
  jsonResume = generateJsonResume(extractedResumeText, openAiKey, openAiModel)

  print(extractedResumeText)
  
  return {"resume_payload": jsonResume, "account_id":account_id};

# python3 -m uvicorn main:app --reload