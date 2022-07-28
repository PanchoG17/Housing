(function() {

    const lat = -54.80711067685048;
    const lng = -68.32006451162783;
    const mapa = L.map('mapa').setView([lat, lng ], 14);


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''
    }).addTo(mapa);


})()