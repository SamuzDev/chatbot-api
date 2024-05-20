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
    model: "gpt-3.5-turbo",
    messages: [
      { 
        role: "system", 
        content: "You are a helpful assistant." 
      }, 
      { role: "user", content: message }
    ],
  });
  res.json(response.choices[0].message.content);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});