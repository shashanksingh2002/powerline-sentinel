var map = L.map('map').setView([12.8249, 80.0451], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const maps = () => {

// Example data

fetch('/api/maps',{
    method : "POST",
    headers : {
        "Content-Type" : "application/json"
    },
})
.then(response => response.json())
.then(result => {
    const dataPoints = [...Object.values(result)];
    // Add markers for transformers
    dataPoints.forEach(function(transformer,idx) {

    console.log(transformer.latitude,transformer.longitude,transformer.health)
    var markerColor = transformer.health === "Online" ? "green" : "red";

    // Create a marker and add it to the map
    L.marker([transformer.latitude, transformer.longitude], {
        icon: L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${markerColor};">${idx}</div>`
        })
    }).addTo(map);
});
})
.catch(err => console.error(err))
}

setInterval(maps,5000)

maps()
