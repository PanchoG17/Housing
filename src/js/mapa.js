(function() {

    const lat = -54.80711067685048;
    const lng = -68.32006451162783;
    const mapa = L.map('mapa').setView([lat, lng ], 14);

    let marker;

    //Provider y Geocoder
    const geoCoderService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''
    }).addTo(mapa);

    // Pin de localización
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    // Obtener lat y long del pin
    marker.on('moveend', (e) => {

        marker = e.target
        const position = marker.getLatLng()

        mapa.panTo(new L.LatLng(position.lat, position.lng))

        // Obtener nombre de las calles
        geoCoderService.reverse().latlng(position, 13).run( (error, resultado) => {

            marker.bindPopup(resultado.address.LongLabel)
            //marker.togglePopup()

            document.querySelector('.calle').textContent = resultado?.address?.Address ?? ''

            document.querySelector('#calle').value = resultado?.address?.Address ?? ''
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? ''
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? ''


        })
    })

})()