const axios = require('axios');

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const endpoint = req.url.replace('/api/proxy', '');
    const targetUrl = `https://irasv1.iub.edu.bd:8079${endpoint}`;

    try {
        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: typeof req.body === 'string' ? JSON.parse(req.body) : req.body,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
                'Authorization': req.headers.authorization || '',
                // IIS server-er jonno ei 3ti header khub-i critical
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Origin': 'https://irasv1.iub.edu.bd',
                'Referer': 'https://irasv1.iub.edu.bd/'
            }
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("Proxy Error Details:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { message: "Proxy Error" });
    }
}
