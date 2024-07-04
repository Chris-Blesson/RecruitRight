from fastapi import FastAPI, File, UploadFile
from docUtils import extractTextFromPdf
from resumeGenerator import generateJsonResume

app = FastAPI()

@app.post("/parse")
async def parseResume(file: UploadFile=File(...)):

  extractedResumeText = await extractTextFromPdf(file)
  openAiModel="gpt-3.5-turbo"
  #TODO: Use api key from env variable
  openAiKey=""
  jsonResume = generateJsonResume(extractedResumeText, openAiKey, openAiModel)

  print(extractedResumeText)
  
  return jsonResume;
# python3 -m uvicorn main:app --reload