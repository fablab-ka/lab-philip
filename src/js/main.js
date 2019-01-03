document.getElementById('save-new-object-button').addEventListener('click', (e) => {
    const name = document.getElementById('object-name-input').value;
    const location = document.getElementById('location-input').value;
    const comment = document.getElementById('comment-input').value;

    const data = JSON.stringify({
        name,
        location,
        comment
    });

    fetch('/data', { method: 'POST', body: data, headers: { 'Content-Type': 'application/json' }})
        .then((result) => {
            document.getElementById('object-name-input').value = '';
            document.getElementById('location-input').value = '';
            document.getElementById('comment-input').value = '';
            console.log(result);
        });

    e.stopPropagation();
    e.preventDefault();
    return false;
});

document.getElementById('send-query-button').addEventListener('click', (e) => {
    const query = document.getElementById('query-input').value;

    fetch('/data?query=' + query)
        .then((res) => res.json())
        .then((result) => {
            console.log(result);

            document.querySelector('.summary-container').style.display = 'flex';
            const list = document.querySelector('#result-summary > ul');
            while (list.childElementCount > 0) {
                list.removeChild(list.firstChild);
            }

            result.forEach((resultEntry) => {
                const item = document.createElement('li');
                item.innerText = resultEntry.name + ' ➡ ' + resultEntry.location;
                if (resultEntry.comment) {
                    item.innerText += ' # ' + resultEntry.comment;
                }
                list.appendChild(item);
            })
        });

    e.stopPropagation();
    e.preventDefault();
    return false;
});

document.querySelector('.summary-container').addEventListener('click', (e) => {
    document.querySelector('.summary-container').style.display = 'none';
});