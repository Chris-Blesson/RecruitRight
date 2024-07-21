import requests
from pdfminer.high_level import extract_text as extractText
from io import BytesIO

async def extractTextFromPdfUrl(url):
    response = requests.get(url)
    response.raise_for_status()  # Ensure we raise an error for bad responses
    file_stream = BytesIO(response.content)
    return extractText(file_stream)
