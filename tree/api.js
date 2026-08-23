const TREE_API = process.env.TREE_API ?? "http://localhost:4000";

async function request(path, options = {}) {
    const start = performance.now();

    const response = await fetch(`${TREE_API}${path}`, {
        ...options,
        signal: AbortSignal.timeout(5000)
    });

    const duration = performance.now() - start;

    if (!response.ok) {
        throw new Error(`Tree API returned ${response.status} ${response.statusText}`)
    }

    return {
        response,
        duration
    };
}

async function getCurrentPattern() {
    const { response, duration } = await request("/current/pattern");

    const data = await response.json();

    return {
        ...data,
        responseTime:duration
    };
}

module.exports = {
    getCurrentPattern,
};