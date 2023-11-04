
const logout = document.querySelector('.logout')
const exportData = document.querySelector('.export')

exportData.addEventListener('click', async (e) => {
    try {
        // Send a request to the server to get data
        const response = await fetch('/api/maps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Check if the response is successful
        if (response.ok) {
            // Parse the JSON response
            const jsonData = await response.json();

            // Convert JSON object to string
            const jsonString = JSON.stringify(jsonData, null, 2);

            // Create a Blob from the JSON string
            const blob = new Blob([jsonString], { type: 'application/json' });

            // Create a temporary anchor element
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = 'data.json';

            // Append the anchor to the body and trigger a click event
            document.body.appendChild(downloadLink);
            downloadLink.click();

            // Remove the anchor from the body
            document.body.removeChild(downloadLink);

            // Delete the local data.json file
            fetch('/api/deleteFile', {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                console.log('File deleted:', data);
            })
            .catch(error => {
                console.error('Error deleting file:', error);
            });
        } else {
            console.error('Error exporting data:', response.statusText);
        }
    } catch (error) {
        console.error('Error exporting data:', error);
    }
});

logout.addEventListener('click', (e) => {
    window.location.href = '/logout'
})


