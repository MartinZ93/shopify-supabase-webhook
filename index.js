const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

// Deine Railway Environment-Variablen — KEINE harten Keys im Code!
const SUPABASE_URL = process.env.SUPABASE_URL;   // https://zxveazzlbyyxqjrsczut.supabase.co/rest/v1
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;  // Service Role Key von Supabase

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Webhook-Server läuft!');
});

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
  product_name: order.line_items?.[0]?.title || 'unknown',
  created_at: new Date().toISOString(),
  order_raw: order
})

      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase Fehler:', errorText);
      return res.status(500).send('Supabase-Fehler');
    }

    console.log('Bestellung erfolgreich gespeichert.');
    res.status(200).send('OK');
  } catch (err) {
    console.error('Serverfehler:', err);
    res.status(500).send('Serverfehler');
  }
});

app.listen(port, () => {
  console.log(`Webhook-Server läuft auf Port ${port}`);
});
