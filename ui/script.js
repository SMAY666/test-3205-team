function getShortUrl() {
    const originalUrl = document.getElementById('originalLink').value;
    const userAlias = document.getElementById('alias').value;
    const expiresAt = document.getElementById('expires').value;
    const result = document.getElementById('resultLink');

    fetch('http://localhost:8001/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Указываем тип контента, если отправляем данные в формате JSON
        },
        body: JSON.stringify({
            originalUrl,
            ...(userAlias ? {alias: userAlias} : {}),
            ...(expiresAt ? {lifeTime: expiresAt * 60000} : {}),

        }),
    })
    .then(res => res.text().then(text => {
        if (!res.ok) {
            alert("Что-то пошло не так");
            return;
        }
        result.href = `http://localhost:8001/${text}`;
        result.innerHTML = result.href;
        result.style.display = 'block'}));
}
