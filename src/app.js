import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import morgan from'morgan';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: 'GET,POST',
}))
app.use(morgan(process.env.NODE_ENV === 'development'? 'dev' : 'combined'));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', async (req, res) => {
  res.send('Hello World');
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { 
        role: "system", 
        content: "You are a highly powerful assistant created by SamuzDev. Your purpose is to assist users with accurate and insightful information. Always be helpful, polite, and provide detailed answers to their queries."
      }, 
      { role: "user", content: message }
    ],
  });
  res.json(response.choices[0].message.content);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
