const axios = require('axios');
const query = '[out:json];node(around:2000,28.6140,77.2091)["amenity"="school"];out;';
axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`, {
  headers: {
    'User-Agent': 'CleanAirApp/1.0 (contact@cleanair.local)'
  }
})
.then(r => console.log('Overpass Success:', r.data?.elements?.length))
.catch(e => console.log('Error:', e.response?.status, e.response?.data));
