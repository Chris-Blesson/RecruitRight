export const promptGenerationHandler = async ({ content }) => {
  const response = await fetch("/api/chatgpt", {
    method: "POST",
    body: JSON.stringify({ prompt: content }),
  });
  return await response.json();
};
