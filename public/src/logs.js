const logsTable = document.querySelector('.logs');

function fetchData() {
    fetch('/api/maps', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        const dataPoints = Object.values(result);
        let html = '<table><tr><th>Transformer ID</th><th>Status</th><th>Longitude</th><th>Latitude</th><th>Email</th><th>Mail Sent</th><th>Timestamp</th></tr>';
        
        dataPoints.forEach(data => {
            html += `<tr>
                        <td>${data.uuid??''}</td>
                        <td>${data.health??''}</td>
                        <td>${data.longitude??''}</td>
                        <td>${data.latitude??''}</td>
                        <td>${data.email??''}</td>
                        <td>${false}</td>
                        <td>${data.timestamp??''}</td>
                    </tr>`;
        });
        html += '</table>'
        logsTable.innerHTML = html;
    })
    .catch(err => console.error(err));
}

// Fetch data every 3 seconds
setInterval(fetchData, 3000);

// Initial fetch on page load
fetchData();
