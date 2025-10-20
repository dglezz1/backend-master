// File upload handling
document.getElementById('designFiles').addEventListener('change', function(e) {
    const files = e.target.files;
    const uploadDiv = e.target.parentElement;
    
    if (files.length > 0) {
        let fileNames = [];
        for (let i = 0; i < Math.min(files.length, 5); i++) {
            fileNames.push(files[i].name);
        }
        uploadDiv.innerHTML = `
            <input type="file" id="designFiles" name="designFiles" multiple accept="image/*" max="5">
            <p>✅ ${fileNames.length} archivo(s) seleccionado(s)</p>
            <small>${fileNames.join(', ')}</small>
        `;
    }
});

// Form submission
document.getElementById('cakeQuoteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Calculate estimated price
    const guests = parseInt(document.getElementById('guests').value);
    const flavor = document.querySelector('input[name="flavor"]:checked');
    
    if (flavor && guests) {
        const pricePerPerson = {
            'vainilla': 25,
            'chocolate': 30,
            'fresa': 35,
            'redvelvet': 40,
            'zanahoria': 38,
            'limon': 32
        };
        
        const estimatedPrice = guests * pricePerPerson[flavor.value];
        
        alert(`¡Formulario enviado exitosamente! 🎉\n\nCotización estimada: $${estimatedPrice} MXN\n\nRecibirás la cotización final en las próximas 24 horas.`);
    } else {
        alert('¡Formulario enviado exitosamente! 🎉\n\nRecibirás la cotización final en las próximas 24 horas.');
    }
});

// Set minimum date to today
document.getElementById('deliveryDate').min = new Date().toISOString().split('T')[0];
