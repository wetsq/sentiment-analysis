const express = require('express');
const Groq = require('groq-sdk');
const { HfInference } = require("@huggingface/inference"); 
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const client = new Groq({
  apiKey: "",
});

const hf = new HfInference("");

app.post('/analyze', async (req, res) => {
  const { text, model } = req.body;

  if (!text || !model) {
    return res.status(400).json({ error: 'Both text and model are required.' });
  }

  let sentiment, confidence;

  try {
    if (model === 'custom') {
      const model_name = "wetsq/sentiment-model"
      const result = await hf.textClassification({
        model: model_name,
        inputs: text
      });
      console.log(result)
      confidence = result[0].score;
      if(result[0].label === 'LABEL_0'){
        sentiment = 'negative';
      } else {
        sentiment = 'positive';
      }

    } else if (model === 'llama') {
      const chatCompletion = await client.chat.completions.create({
        model: 'llama3-8b-8192',
        response_format: { "type": "json_object" },
        messages: [
          {
            role: 'user',
            content: "Classify the sentiment of this text as positive or negative. Give the response as a json object with fields for the sentiment, that can be 'positive' or 'negative', and confidence 'score' of the rating as a value between 0 and 1. Only provide the json object as a response. : " + text
          }
        ],
      })

      completion = chatCompletion.choices[0].message.content
      response = JSON.parse(completion)
      
      sentiment = response.sentiment;
      confidence = response.confidence;

    } else {
      return res.status(400).json({ error: 'Invalid model specified.' });
    }

    res.json({ sentiment, confidence });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while analyzing the text.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});