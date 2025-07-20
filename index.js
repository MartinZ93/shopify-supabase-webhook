const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express(); // <-- ganz wichtig, hier wird "app" definiert
const port = process.env.PORT || 3000;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
const PRODUCT_ID = process.env.PRODUCT_ID;
const PLANTING_AREA = process.env.PLANTING_AREA;

app.use(bodyParser.json());

// ... hier kommt dein app.post('/shopify-webhook', async (req, res) => { ... } ...

app.listen(port, () => {
  console.log(`Webhook-Server läuft auf Port ${port}`);
});
