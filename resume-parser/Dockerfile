# Base image
FROM ubuntu:22.04

# Working directory, Streamlit does not work at root
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt packages.txt /app/

# Install Python
RUN apt update -y
RUN apt install -y python3-pip python-dev-is-python3 build-essential


# Install dependencies
RUN pip install -r requirements.txt && \
    DEBIAN_FRONTEND=noninteractive xargs apt install -y < packages.txt
RUN pip install fastapi
RUN pip install uvicorn

# Copy the current code
COPY . .

CMD [ "python3", "-m", "uvicorn", "main:app" ]
