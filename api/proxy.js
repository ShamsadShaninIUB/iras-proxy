const axios = require('axios');

export default async function handler(req, res) {
    // CORS Header setup (Jate AmarHoster er cPanel theke Laravel easily data nite pare)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // OPTIONS request handle kora (Browser er preflight request er jonno)
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Endpoint dynamic bhabe extract kora
    const endpoint = req.url.replace('/api/proxy', '');
    const targetUrl = `https://iras.iub.edu.bd:8079${endpoint}`;

    try {
        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            headers: {
                'Content-Type': 'application/json',
                // Login token pathanor jonno
                'Authorization': req.headers.authorization || ''
            }
        });

        // IUB server theke paowa data return kora
        res.status(response.status).json(response.data);

    } catch (error) {
        // Error handling
        const statusCode = error.response ? error.response.status : 500;
        const errorData = error.response ? error.response.data : { message: "Proxy Error", details: error.message };
        
        res.status(statusCode).json(errorData);
    }
}