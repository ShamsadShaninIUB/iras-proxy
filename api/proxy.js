const axios = require('axios');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const endpoint = req.url.replace('/api/proxy', '');
    
    // Exact Host: iras.iub.edu.bd (without v1) and forced double slash
    const targetUrl = `https://iras.iub.edu.bd:8079//${endpoint.replace(/^\//, '')}`;

    try {
        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body, 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': req.headers.authorization || '',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
                // Origin and Referer explicitly pointing to irasv1
                'Origin': 'https://irasv1.iub.edu.bd',
                'Referer': 'https://irasv1.iub.edu.bd/'
            }
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: "Proxy Error" });
    }
}
