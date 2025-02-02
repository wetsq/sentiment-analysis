## Running React frontend

install dependencies with

```bash
npm install
```

Run the app

```bash
npm start
```

This should open the app on your browser window.


## Running Node.js backend

navigate to the backend directory and install dependencies

```bash
npm install
```

You need to set the Groq and HuggingFace api keys to the index.js file

Run the backend

```bash
npm start
```

## Running notebook

The notebook can be ran with services such as Colab or Kaggle or locally with Jupyter notebook. The necessary dependencies are listed at the top of the file


## API Endpoint


POST /analyze


Request

Headers:

```json
Content-Type: application/json
```

Body:

```json
{
  "text": "Your input text here",
  "model": "custom" | "llama"
}
```

Response

```
{
  "sentiment": "positive" | "negative",
  "confidence": 0.95
}
```
