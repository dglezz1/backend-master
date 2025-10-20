/* ============================================
   FRIMOUSSE PÂTISSERIE - QUOTE FORM JAVASCRIPT
   Backend Integration Version with Enhanced Functionality
   ============================================ */

// PRICING CONFIGURATION - Edit these values to update prices
const PRICING = {
    // 3 Leches Cakes (per person)
    threeMilk: {
        durazno: 35,
        fresas: 40,
        pinon: 45,
        pistache: 48,
        oreo: 42,
        moka: 45,
        cereza: 50,
        nuez: 45,
        frutos: 48,
        frutas: 40,
        coco: 42,
        mango: 45,
        chocoavellana: 50,
        cajeta: 48
    },
    
    // Custom Cakes Base Price (per person)
    custom: 35,
    
    // Premium Cakes (per person)
    premium: {
        matilda: 80,
        redvelvet: 75,
        zanahoria: 70,
        selva: 85,
        mazapan: 75,
        ferrero: 90,
        rafaello: 88,
        opera: 95,
        tiramisu: 85,
        milhojas: 80
    }
};

// Global variables
let currentQuoteData = null;

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all form functionality
    initializeForm();
    initializeCakeTypeSelection();
    initializeRangeSlider();
    initializeAllergySection();
    initializeDeliverySection();
    initializeFileUpload();
    initializeFormSubmission();
    calculateAndShowQuote();
    
    console.log('✅ Frimousse Quote Form initialized with backend integration');
});

// Initialize main form functionality
function initializeForm() {
    console.log('🎂 Initializing Frimousse Quote Form...');
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('deliveryDate');
    if (dateInput) {
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

// Initialize cake type selection
function initializeCakeTypeSelection() {
    const cakeTypeRadios = document.querySelectorAll('input[name="cakeType"]');
    
    cakeTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Hide all sections first
            document.querySelectorAll('.cake-options-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show selected section
            const selectedType = this.value;
            const sectionId = selectedType + 'Section';
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'block';
            }
            
            // Clear other selections
            clearOtherCakeSelections(selectedType);
            
            // Update quote
            calculateAndShowQuote();
        });
    });
}

// Clear selections from other cake types
function clearOtherCakeSelections(selectedType) {
    if (selectedType !== 'threeMilk') {
        document.querySelectorAll('input[name="threeMilkFlavor"]').forEach(input => {
            input.checked = false;
        });
    }
    
    if (selectedType !== 'custom') {
        document.querySelectorAll('input[name="breadFlavor"]').forEach(input => {
            input.checked = false;
        });
        document.querySelectorAll('input[name="fillingFlavor"]').forEach(input => {
            input.checked = false;
        });
    }
    
    if (selectedType !== 'premium') {
        document.querySelectorAll('input[name="premiumCake"]').forEach(input => {
            input.checked = false;
        });
    }
}

// Initialize range slider
function initializeRangeSlider() {
    const slider = document.getElementById('guests');
    const display = document.getElementById('guestCount');
    const deliveryAlert = document.getElementById('deliveryAlert');
    const homeDeliveryOption = document.getElementById('homeDelivery');
    
    if (slider && display) {
        slider.addEventListener('input', function() {
            const value = parseInt(this.value);
            display.textContent = value;
            
            // Show/hide delivery alert based on guest count
            if (deliveryAlert) {
                if (value < 100) {
                    deliveryAlert.style.display = 'block';
                    // Disable home delivery option if less than 100 guests
                    if (homeDeliveryOption) {
                        homeDeliveryOption.disabled = true;
                        // If home delivery was selected, switch to pickup
                        if (homeDeliveryOption.checked) {
                            const pickupOption = document.getElementById('pickupDelivery');
                            if (pickupOption) {
                                pickupOption.checked = true;
                                // Hide home delivery section
                                const homeDeliverySection = document.getElementById('homeDeliverySection');
                                if (homeDeliverySection) {
                                    homeDeliverySection.style.display = 'none';
                                }
                            }
                        }
                    }
                } else {
                    deliveryAlert.style.display = 'none';
                    if (homeDeliveryOption) {
                        homeDeliveryOption.disabled = false;
                    }
                }
            }
            
            calculateAndShowQuote();
        });
        
        // Trigger initial update
        slider.dispatchEvent(new Event('input'));
    }
}

// Initialize allergy section
function initializeAllergySection() {
    const allergyRadios = document.querySelectorAll('input[name="allergies"]');
    const allergyDetails = document.getElementById('allergyDetails');
    
    allergyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (allergyDetails) {
                if (this.value === 'yes') {
                    allergyDetails.style.display = 'block';
                    const textarea = document.getElementById('allergyDescription');
                    if (textarea) {
                        textarea.required = true;
                    }
                } else {
                    allergyDetails.style.display = 'none';
                    const textarea = document.getElementById('allergyDescription');
                    if (textarea) {
                        textarea.required = false;
                        textarea.value = '';
                    }
                }
            }
        });
    });
}

// Initialize delivery section
function initializeDeliverySection() {
    const deliveryRadios = document.querySelectorAll('input[name="deliveryType"]');
    const homeDeliverySection = document.getElementById('homeDeliverySection');
    
    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (homeDeliverySection) {
                if (this.value === 'home') {
                    homeDeliverySection.style.display = 'block';
                    const addressTextarea = document.getElementById('homeDeliveryAddress');
                    if (addressTextarea) {
                        addressTextarea.required = true;
                    }
                } else {
                    homeDeliverySection.style.display = 'none';
                    const addressTextarea = document.getElementById('homeDeliveryAddress');
                    if (addressTextarea) {
                        addressTextarea.required = false;
                        addressTextarea.value = '';
                    }
                }
            }
        });
    });
}

// Initialize file upload functionality
function initializeFileUpload() {
    const fileInput = document.getElementById('designFiles');
    const fileUploadArea = document.querySelector('.file-upload');
    
    if (fileInput && fileUploadArea) {
        // Make the upload area clickable
        fileUploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            
            try {
                // Validate files
                validateImageFiles(files);
                
                // Show preview if container exists
                const previewContainer = document.getElementById('imagePreview');
                if (previewContainer) {
                    showImagePreview(files, 'imagePreview');
                }
                
                console.log(`📸 ${files.length} image(s) selected for upload`);
                
            } catch (error) {
                alert(error.message);
                e.target.value = ''; // Clear the input
            }
        });
    }
}

// Initialize form submission
function initializeFormSubmission() {
    const form = document.getElementById('cakeQuoteForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleFormSubmission();
        });
    }
}

// Handle form submission
async function handleFormSubmission() {
    const form = document.getElementById('cakeQuoteForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    try {
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ Enviando cotización...';
        
        // Prepare form data
        const formData = new FormData(form);
        
        // Add calculated quote information
        const quoteData = calculateQuoteData();
        formData.append('pricePerPerson', quoteData.pricePerPerson);
        formData.append('totalPrice', quoteData.totalPrice);
        
        // Handle allergies
        const hasAllergies = formData.get('allergies') === 'yes';
        formData.append('hasAllergies', hasAllergies);
        if (hasAllergies) {
            formData.append('allergyDetails', formData.get('allergyDescription') || '');
        }
        formData.delete('allergies');
        formData.delete('allergyDescription');
        
        // Handle delivery address
        if (formData.get('deliveryType') === 'home') {
            formData.append('deliveryAddress', formData.get('homeDeliveryAddress') || '');
        }
        formData.delete('homeDeliveryAddress');
        
        // Convert cake type to enum format
        const cakeType = formData.get('cakeType');
        if (cakeType === 'threeMilk') {
            formData.set('cakeType', 'THREE_MILK');
        } else if (cakeType === 'custom') {
            formData.set('cakeType', 'CUSTOM');
        } else if (cakeType === 'premium') {
            formData.set('cakeType', 'PREMIUM');
        }
        
        // Convert delivery type to enum format
        const deliveryType = formData.get('deliveryType');
        if (deliveryType === 'pickup') {
            formData.set('deliveryType', 'PICKUP');
        } else if (deliveryType === 'home') {
            formData.set('deliveryType', 'HOME');
        }
        
        // Handle file uploads
        const fileInput = document.getElementById('designFiles');
        if (fileInput && fileInput.files.length > 0) {
            console.log(`📸 Processing ${fileInput.files.length} files for upload`);
            // Remove old files entry
            formData.delete('designFiles');
            // Add each file individually
            Array.from(fileInput.files).forEach((file, index) => {
                console.log(`Adding file ${index + 1}: ${file.name} (${file.size} bytes)`);
                formData.append('images', file);
            });
        } else {
            console.log('📸 No files selected for upload');
        }
        
        console.log('📤 Submitting quote to backend...');
        
        // Submit to backend
        const result = await submitQuoteToBackend(formData);
        
        if (result.success) {
            // Show success message
            showSuccessMessage(result.data);
            
            // Reset form
            form.reset();
            document.querySelectorAll('.cake-options-section').forEach(section => {
                section.style.display = 'none';
            });
            document.getElementById('estimatedQuote').style.display = 'none';
            
            console.log('✅ Quote submitted successfully:', result.data.quoteNumber);
        } else {
            throw new Error(result.message || 'Error enviando cotización');
        }
        
    } catch (error) {
        console.error('❌ Error submitting quote:', error);
        console.error('🔍 Error type:', typeof error);
        console.error('🔍 Error name:', error.name);
        console.error('🔍 Error message:', error.message);
        
        let errorMessage = 'Load failed';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'No se pudo conectar al servidor. Verifica que el backend esté ejecutándose.';
        } else if (error.name === 'NetworkError') {
            errorMessage = 'Error de red. Verifica tu conexión a internet.';
        } else if (error.message.includes('CORS')) {
            errorMessage = 'Error de CORS. El servidor no permite solicitudes desde este origen.';
        } else {
            errorMessage = error.message || 'Error desconocido';
        }
        
        showErrorMessage(errorMessage);
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🎂 Solicitar Cotización';
    }
}

// Calculate quote data
function calculateQuoteData() {
    const guests = parseInt(document.getElementById('guests').value) || 10;
    const cakeType = document.querySelector('input[name="cakeType"]:checked')?.value;
    
    let pricePerPerson = 0;
    
    if (cakeType === 'threeMilk') {
        const flavor = document.querySelector('input[name="threeMilkFlavor"]:checked')?.value;
        pricePerPerson = PRICING.threeMilk[flavor] || 35;
    } else if (cakeType === 'custom') {
        pricePerPerson = PRICING.custom;
    } else if (cakeType === 'premium') {
        const premiumType = document.querySelector('input[name="premiumCake"]:checked')?.value;
        pricePerPerson = PRICING.premium[premiumType] || 75;
    }
    
    const totalPrice = pricePerPerson * guests;
    
    return {
        pricePerPerson: pricePerPerson,
        totalPrice: totalPrice,
        guests: guests,
        cakeType: cakeType
    };
}

// Calculate and show quote
function calculateAndShowQuote() {
    const quoteSection = document.getElementById('estimatedQuote');
    const cakeType = document.querySelector('input[name="cakeType"]:checked')?.value;
    
    if (!cakeType || !quoteSection) return;
    
    const quoteData = calculateQuoteData();
    
    // Update quote display
    const typeElement = document.getElementById('quoteType');
    const flavorElement = document.getElementById('quoteFlavor');
    const guestsElement = document.getElementById('quoteGuests');
    const pricePerPersonElement = document.getElementById('quotePricePerPerson');
    const totalElement = document.getElementById('quoteTotal');
    
    if (typeElement) {
        const typeNames = {
            'threeMilk': 'Pastel 3 Leches',
            'custom': 'Pastel Personalizado',
            'premium': 'Pastel Premium'
        };
        typeElement.textContent = typeNames[cakeType] || cakeType;
    }
    
    if (flavorElement) {
        let flavorText = 'No seleccionado';
        
        if (cakeType === 'threeMilk') {
            const flavor = document.querySelector('input[name="threeMilkFlavor"]:checked')?.value;
            if (flavor) flavorText = getFlavorDisplayName(flavor);
        } else if (cakeType === 'custom') {
            const breadFlavor = document.querySelector('input[name="breadFlavor"]:checked')?.value;
            const fillingFlavor = document.querySelector('input[name="fillingFlavor"]:checked')?.value;
            if (breadFlavor && fillingFlavor) {
                flavorText = `${getFlavorDisplayName(breadFlavor)} + ${getFlavorDisplayName(fillingFlavor)}`;
            } else if (breadFlavor || fillingFlavor) {
                flavorText = 'Selección incompleta';
            }
        } else if (cakeType === 'premium') {
            const premiumType = document.querySelector('input[name="premiumCake"]:checked')?.value;
            if (premiumType) flavorText = getPremiumDisplayName(premiumType);
        }
        
        flavorElement.textContent = flavorText;
    }
    
    if (guestsElement) {
        guestsElement.textContent = `${quoteData.guests} personas`;
    }
    
    if (pricePerPersonElement) {
        pricePerPersonElement.textContent = `$${quoteData.pricePerPerson} MXN`;
    }
    
    if (totalElement) {
        totalElement.textContent = `$${quoteData.totalPrice} MXN`;
    }
    
    // Show quote section
    quoteSection.style.display = 'block';
    
    // Store current quote data
    currentQuoteData = quoteData;
}

// Get display name for flavors
function getFlavorDisplayName(value) {
    const displayNames = {
        'durazno': 'Durazno',
        'fresas': 'Fresas con crema',
        'pinon': 'Piñón',
        'pistache': 'Pistache',
        'oreo': 'Oreo',
        'moka': 'Moka',
        'cereza': 'Cereza con nuez',
        'nuez': 'Nuez',
        'frutos': 'Frutos rojos',
        'frutas': 'Frutas',
        'coco': 'Coco',
        'mango': 'Mango',
        'chocoavellana': 'Chocoavellana',
        'cajeta': 'Cajeta con nuez',
        'vainilla': 'Vainilla',
        'rompope': 'Rompope',
        'chocolate': 'Chocolate',
        'redvelvet': 'Red Velvet',
        'naranja': 'Naranja',
        'nata': 'Nata',
        'limon': 'Limón',
        'zanahoria': 'Zanahoria',
        'helado': 'Pastel Helado',
        'coctel': 'Coctel de frutas'
    };
    return displayNames[value] || value;
}

// Get display name for premium cakes
function getPremiumDisplayName(value) {
    const displayNames = {
        'matilda': 'Chocolate Matilda',
        'redvelvet': 'Red Velvet Premium',
        'zanahoria': 'Zanahoria Premium',
        'selva': 'Selva Negra',
        'mazapan': 'Mazapán',
        'ferrero': 'Ferrero',
        'rafaello': 'Rafaello',
        'opera': 'Opera al Té Verde',
        'tiramisu': 'Tiramisú',
        'milhojas': 'Mil Hojas'
    };
    return displayNames[value] || value;
}

// Show success message
function showSuccessMessage(data) {
    const message = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <h4 class="alert-heading">🎉 ¡Cotización enviada exitosamente!</h4>
            <p><strong>Número de cotización:</strong> ${data.quoteNumber}</p>
            <p>Tu cotización ha sido enviada y recibirás un correo electrónico con los detalles en las próximas 24 horas.</p>
            
            <div class="d-flex gap-2 my-3">
                <button onclick="downloadQuotePDF('${data.id}')" class="btn btn-primary">
                    <i class="fas fa-download"></i> Descargar Cotización PDF
                </button>
                <a href="https://wa.me/527717227089?text=Hola%20Frimousse,%20mi%20número%20de%20cotización%20es:%20${data.quoteNumber}" 
                   target="_blank" class="btn btn-success">
                    <i class="fab fa-whatsapp"></i> Contactar por WhatsApp
                </a>
            </div>
            
            <p><strong>Próximos pasos:</strong></p>
            <ul>
                <li>Descarga tu cotización usando el botón de arriba</li>
                <li>Re</li>
                <li>Una vez que recibas la cotización final, realiza tu depósito lo antes posible para poder agendar tu pedido</li>
                <li>Puedes contactarnos por WhatsApp usando el botón de arriba</li>
            </ul>
            <hr>
            <p class="mb-0">¡Gracias por elegir Frimousse Pâtisserie! 🎂</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Insert message at the top of the form container
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.insertAdjacentHTML('afterbegin', message);
        
        // Scroll to top to show the message
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Show error message
function showErrorMessage(errorMessage) {
    const message = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <h4 class="alert-heading">❌ Error al enviar cotización</h4>
            <p>${errorMessage}</p>
            <p>Por favor, inténtalo de nuevo o contáctanos directamente por WhatsApp.</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Insert message at the top of the form container
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.insertAdjacentHTML('afterbegin', message);
        
        // Scroll to top to show the message
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Function to download quote PDF
async function downloadQuotePDF(quoteId) {
    try {
        console.log('📥 Downloading PDF for quote:', quoteId);
        
        const response = await fetch(`http://localhost:3001/api/quote/${quoteId}/pdf`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Get the PDF blob
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        
        // Get filename from response headers if available
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'cotizacion-frimousse.pdf';
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="(.+)"/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        console.log('✅ PDF downloaded successfully');
        
    } catch (error) {
        console.error('❌ Error downloading PDF:', error);
        alert('Error al descargar el PDF. Por favor, contacta con nosotros por WhatsApp.');
    }
}

// Add event listeners for flavor selection to update quote
document.addEventListener('change', function(e) {
    if (e.target.name === 'threeMilkFlavor' || 
        e.target.name === 'breadFlavor' || 
        e.target.name === 'fillingFlavor' || 
        e.target.name === 'premiumCake') {
        calculateAndShowQuote();
    }
});

console.log('✅ Frimousse Quote Form with Backend Integration loaded successfully');
