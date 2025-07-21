const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

const SUPABASE_URL = process.env.SUPABASE_URL;  // ohne /rest/v1 — das hängst du im Code an!
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

app.use(bodyParser.json());

app.post('/shopify-webhook', async (req, res) => {
  const order = req.body;
  console.log('Neue Bestellung:', JSON.stringify(order, null, 2));

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_API_KEY,
        'Authorization': `Bearer ${SUPABASE_API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        shopify_order_id: order.id?.toString() || 'unknown',
        customer_id: order.customer?.id?.toString() || 'unknown',
        created_at: new Date().toISOString(),
        order_raw: order
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase Fehler:', errorText);
      return res.status(500).send('Fehler bei Supabase');
    }

    console.log('Erfolgreich in Supabase gespeichert');
    res.status(200).send('OK');
  } catch (err) {
    console.error('Serverfehler:', err);
    res.status(500).send('Serverfehler');
  }
});

app.listen(port, () => {
  console.log(`Webhook-Server läuft auf Port ${port}`);
});
