const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
const PRODUCT_ID = process.env.PRODUCT_ID;
const PLANTING_AREA = process.env.PLANTING_AREA;

app.use(bodyParser.json());

app.post('/shopify-webhook', async (req, res) => {
  const order = req.body;

  // Logging für Kontrolle
  console.log('Neue Bestellung empfangen:', JSON.stringify(order, null, 2));

  // Menge aller bestellten Artikel berechnen
  const amount = order.line_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shopify_order_id: order.id?.toString() || 'unknown',
        product_id: PRODUCT_ID,
        amount,
        planting_area: PLANTING_AREA
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fehler bei Supabase:', errorText);
      return res.status(500).send('Supabase-Fehler');
    }

    console.log('Bestellung erfolgreich gespeichert.');
    res.status(200).send('OK');
  } catch (err) {
    console.error('Fehler beim Speichern:', err);
    res.status(500).send('Serverfehler');
  }
});

app.listen(port, () => {
  console.log(`Webhook-Server läuft auf Port ${port}`);
});
