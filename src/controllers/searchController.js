const searchImages = async (req, res) => {
  try {
    const { query } = req.query; // e.g. /api/search?query=mars

    if (!query) {
      return res.status(400).json({ message: 'A search query is required' });
    }

    const response = await fetch(
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`
    );
    const data = await response.json();

    // NASA's response is deeply nested — let's simplify it before sending to frontend
    const results = data.collection.items.slice(0, 12).map(item => {
      return {
        title: item.data[0].title,
        description: item.data[0].description,
        image_url: item.links ? item.links[0].href : null,
        date_created: item.data[0].date_created
      };
    });

    res.json({ query, count: results.length, results });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { searchImages };