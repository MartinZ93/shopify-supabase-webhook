const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

const SUPABASE_URL = process.env.SUPABASE_URL; // z.B. https://zxveazzlbyyxqjrsczut.supabase.co/rest/v1
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

app.use(bodyParser.json());

app.post('/shopify-webhook', async (req, res) => {
  const order = req.body;

  console.log('Neue Bestellung empfangen:', JSON.stringify(order, null, 2));

  try {
    const response = await fetch(`${SUPABASE_URL}/orders`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        shopify_order_id: order.id?.toString() || 'unknown',
        customer_id: order.customer?.id?.toString() || 'unknown',
        order_raw: order
      })
    });

    if (!response.ok
