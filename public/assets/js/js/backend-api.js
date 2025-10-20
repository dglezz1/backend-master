// Configuración del backend API
const API_CONFIG = {
    baseURL: 'http://localhost:3001/api',
    endpoints: {
        submitQuote: '/submit',
        getQuotes: '/quotes',
        getQuote: '/quote',
        downloadPDF: '/quote'
    }
};

// Función para enviar cotización al backend
async function submitQuoteToBackend(formData) {
    try {
        console.log('🚀 Starting quote submission...');
        console.log('📡 URL:', `${API_CONFIG.baseURL}${API_CONFIG.endpoints.submitQuote}`);
        console.log('📦 FormData entries:');
        
        // Log FormData contents
        for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value);
        }
        
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.submitQuote}`, {
            method: 'POST',
            body: formData // FormData object con archivos
        });

        console.log('📥 Response received:', response.status, response.statusText);
        
        const result = await response.json();
        console.log('📄 Response data:', result);
        
        if (!response.ok) {
            throw new Error(result.message || 'Error enviando cotización');
        }

        console.log('✅ Quote submitted successfully');
        return result;
    } catch (error) {
        console.error('❌ Error submitting quote:', error);
        console.error('🔍 Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
}

// Función para descargar PDF
async function downloadQuotePDF(quoteId) {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.downloadPDF}/${quoteId}/pdf`);
        
        if (!response.ok) {
            throw new Error('Error descargando PDF');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `cotizacion-${quoteId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        throw error;
    }
}

// Función para obtener cotización por número
async function getQuoteByNumber(quoteNumber) {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}/quote/number/${quoteNumber}`);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Cotización no encontrada');
        }

        return result.data;
    } catch (error) {
        console.error('Error getting quote:', error);
        throw error;
    }
}

// Validación de archivos de imagen
function validateImageFiles(files) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = 5;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    console.log(`🔍 Validating ${files.length} files`);
    
    if (files.length > maxFiles) {
        throw new Error(`Máximo ${maxFiles} archivos permitidos. Seleccionaste ${files.length} archivos.`);
    }
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Validating file ${i + 1}: ${file.name} (${file.type}, ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        
        if (!allowedTypes.includes(file.type)) {
            throw new Error(`Tipo de archivo no válido: "${file.name}". Solo se permiten imágenes (JPEG, PNG, WebP).`);
        }
        
        if (file.size > maxSize) {
            throw new Error(`Archivo muy grande: "${file.name}". Tamaño: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo 5MB por archivo.`);
        }
    }
    
    console.log('✅ All files validated successfully');
    return true;
}

// Función para mostrar vista previa de imágenes
function showImagePreview(files, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'image-preview-item';
            previewDiv.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}" style="max-width: 100px; max-height: 100px; object-fit: cover;">
                <p style="font-size: 12px; margin: 5px 0 0 0;">${file.name}</p>
            `;
            container.appendChild(previewDiv);
        };
        
        reader.readAsDataURL(file);
    });
}

// Exportar para uso global
window.API_CONFIG = API_CONFIG;
window.submitQuoteToBackend = submitQuoteToBackend;
window.downloadQuotePDF = downloadQuotePDF;
window.getQuoteByNumber = getQuoteByNumber;
window.validateImageFiles = validateImageFiles;
window.showImagePreview = showImagePreview;
