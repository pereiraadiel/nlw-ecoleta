import express from 'express';

const app = express();

app.get('/users', (req, res) => {
  console.log("listando usuarios");
  res.json([
    "Adiel",
    "Pereira",
    "Adiel Pereira",
    "Pereira Adiel",
    "Adao",
    "Abraao"
  ]);
})

app.listen(3333);