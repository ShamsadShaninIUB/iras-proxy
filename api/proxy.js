const axios = require('axios');

export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Double slash force korar jonno logic:
    // req.url jodi '/v1/commonsetting/...' hoy, tobe 
    // targetUrl e 'https://irasv1.iub.edu.bd:8079//v1/commonsetting/...' hobe.
    const endpoint = req.url.replace('/api/proxy', '');
    // Hardcoded double slash for testing:
    const targetUrl = `https://irasv1.iub.edu.bd:8079//${endpoint.replace(/^\//, '')}`;

    try {
        const response = await axios({
            method: req.method,
            url: targetUrl, // Ekhane URL ta ekhon '/v1/...'
            data: req.body,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*',
                'Authorization': req.headers.authorization || '',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
                'Origin': 'https://irasv1.iub.edu.bd',
                'Referer': 'https://irasv1.iub.edu.bd/'
            }
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: "Proxy Error" });
    }
}
