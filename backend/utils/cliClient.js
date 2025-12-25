const axios = require('axios');
const { getToken, getRepoId } = require('./cliAuth');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

async function makeRequest(method, endpoint, data = null, repoId = null) {
    const token = await getToken();
    const repo = repoId || await getRepoId();

    if (!token) {
        throw new Error('Not authenticated. Please run "devtrack login" first.');
    }

    const url = repo ? `${API_BASE_URL}${endpoint.replace(':repoId', repo)}` : `${API_BASE_URL}${endpoint}`;
    
    const config = {
        method,
        url,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        config.data = data;
    }

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || error.response.data.error || 'Request failed');
        }
        throw error;
    }
}

module.exports = {
    makeRequest,
    API_BASE_URL
};

