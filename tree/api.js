const TREE_API = process.env.TREE_API ?? "http://localhost";

async function request(path, options = {}) {
    const response = await fetch(`${TREE_API}${path}`, {
        ...options,
        signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
        throw new Error(`Tree API returned ${response.status} ${response.statusText}`)
    }

    return response;
}