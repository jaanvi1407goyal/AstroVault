const getTonightSky = async (req, res) => {
  try {
    // Get the visitor's real IP address from request headers
    // (Railway and most hosts pass this via x-forwarded-for)
    const visitorIP = req.headers['x-forwarded-for']?.split(',')[0];

// If there's no real forwarded IP (e.g. local testing), let ip-api auto-detect
// instead of passing a useless local address like ::1 or 127.0.0.1
const locationResponse = await fetch(
  visitorIP ? `http://ip-api.com/json/${visitorIP}` : 'http://ip-api.com/json/'
);
    const location = await locationResponse.json();

    const { lat, lon, city, country } = location;

    // Step B: Get sunrise/sunset using Open-Meteo
    const sunResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunrise,sunset&timezone=auto`
    );
    const sunData = await sunResponse.json();

    // Step C: Get moon phase using the US Navy Astronomical Applications API
    const today = new Date().toISOString().split('T')[0]; // e.g. "2026-07-14"
    const moonResponse = await fetch(
      `https://aa.usno.navy.mil/api/rstt/oneday?date=${today}&coords=${lat},${lon}`
    );
    const moonData = await moonResponse.json();

    // Step D: Get current ISS (International Space Station) position
    const issResponse = await fetch('http://api.open-notify.org/iss-now.json');
    const issData = await issResponse.json();

    // Step E: Combine everything into one clean response
    res.json({
      location: { city, country, lat, lon },
      sun: {
        sunrise: sunData.daily.sunrise[0],
        sunset: sunData.daily.sunset[0]
      },
      moon: {
        phase: moonData.properties.data.curphase,
        fracillum: moonData.properties.data.fracillum
      },
      iss: {
        latitude: issData.iss_position.latitude,
        longitude: issData.iss_position.longitude,
        timestamp: issData.timestamp
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTonightSky };