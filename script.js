async function loadMessages() {
    const response = await fetch('/api/messages');
    const messages = await response.json();
    const container = document.getElementById('messages');
    
    container.innerHTML = messages.map(msg => `
        <div class="message">
            <div class="content">${marked.parse(msg.content)}</div>
            <div class="tags">
                ${msg.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <small>${new Date(msg.createdAt).toLocaleString()}</small>
        </div>
    `).join('');
}

async function submitMessage() {
    const content = document.getElementById('content').value;
    const tags = document.getElementById('tags').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t);

    await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, tags })
    });

    document.getElementById('content').value = '';
    document.getElementById('tags').value = '';
    await loadMessages();
}

// 初始化加载留言
loadMessages();