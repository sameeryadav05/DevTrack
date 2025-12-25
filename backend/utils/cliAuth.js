const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.devtrack');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

async function getConfig() {
    try {
        const data = await fs.readFile(CONFIG_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

async function saveConfig(config) {
    try {
        await fs.mkdir(CONFIG_DIR, { recursive: true });
        await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
    } catch (error) {
        throw new Error(`Failed to save config: ${error.message}`);
    }
}

async function getToken() {
    const config = await getConfig();
    return config?.token || null;
}

async function getRepoId() {
    const config = await getConfig();
    return config?.repoId || null;
}

async function setToken(token) {
    const config = await getConfig() || {};
    config.token = token;
    await saveConfig(config);
}

async function setRepoId(repoId) {
    const config = await getConfig() || {};
    config.repoId = repoId;
    await saveConfig(config);
}

async function clearConfig() {
    try {
        await fs.unlink(CONFIG_FILE);
    } catch (error) {
        // File doesn't exist, that's okay
    }
}

module.exports = {
    getConfig,
    saveConfig,
    getToken,
    getRepoId,
    setToken,
    setRepoId,
    clearConfig,
    CONFIG_FILE
};

