const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

app.use(bodyParser.json());

app.post('/shopify-webhook', async (req, res) => {
  const topic = req.headers['x-shopify-topic'];
  const order = req.body;

  console.log(`Webhook empfangen: ${topic}`);

  try {
    if (topic === 'orders/create') {
      const productName = order.line_items?.[0]?.title || 'unknown';

      const response = await fetch(`${SUPABASE_URL}/orders`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shopify_order_id: order.id?.toString() || 'unknown',
          customer_id: order.customer?.id?.toString() || 'unknown',
          product_name: productName,
          order_raw: order
        })
      });

      console.log('Bestellung gespeichert.');

    } else if (topic === 'orders/cancelled') {
      const shopifyOrderId = order.id?.toString();

      const response = await fetch(`${SUPABASE_URL}/orders?shopify_order_id=eq.${shopifyOrderId}`, {
        method: 'DELETE',
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`
        }
      });

      console.log(`Stornierte Bestellung gelöscht: ${shopifyOrderId}`);
    }

    res.status(200).send('Webhook verarbeitet.');
  } catch (err) {
    console.error('Fehler:', err);
    res.status(500).send('Fehler beim Verarbeiten des Webhooks.');
  }
});

app.listen(port, () => {
  console.log(`Webhook-Server läuft auf Port ${port}`);
});
