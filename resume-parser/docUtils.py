from pdfminer.high_level import extract_text as extractText

from io import BytesIO
async def extractTextFromPdf(file):
    file_bytes = await file.read()
    file_stream = BytesIO(file_bytes)
    return extractText(file_stream)
