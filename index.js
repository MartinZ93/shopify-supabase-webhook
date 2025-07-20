app.post('/shopify-webhook', async (req, res) => {
  const order = req.body;
  const amount = order.line_items.reduce((sum, item) => sum + item.quantity, 0);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_API_KEY,
        'Authorization': `Bearer ${SUPABASE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shopify_order_id: order.id.toString(),
        product_id: PRODUCT_ID,
        amount: amount,
        planting_area: PLANTING_AREA
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase Fehler:', errorText);
      return res.status(500).send('Fehler beim Speichern: ' + errorText);
    }

    res.status(200).send('Order saved to Supabase');
  } catch (error) {
    console.error('Fetch Fehler:', error);
    res.status(500).send('Fehler beim Speichern: ' + error.message);
  }
});
