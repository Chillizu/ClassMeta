export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (url.pathname === '/api/messages') {
            switch (request.method) {
                case 'GET':
                    return getMessages(env);
                case 'POST':
                    return postMessage(request, env);
                default:
                    return new Response('Method not allowed', { status: 405 });
            }
        }
        return new Response('Not found', { status: 404 });
    }
};

async function getMessages(env) {
    const messages = await env.MESSAGES.list();
    const results = await Promise.all(
        messages.keys.map(async (key) => {
            return JSON.parse(await env.MESSAGES.get(key.name));
        })
    );
    return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' }
    });
}

async function postMessage(request, env) {
    const data = await request.json();
    const id = Date.now().toString();
    const message = {
        id,
        content: data.content,
        tags: data.tags,
        createdAt: new Date().toISOString()
    };
    
    await env.MESSAGES.put(id, JSON.stringify(message));
    return new Response(JSON.stringify(message), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}