// Cake Quote Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // File upload handling
    const designFilesInput = document.getElementById('designFiles');
    if (designFilesInput) {
        designFilesInput.addEventListener('change', function(e) {
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
                
                // Re-attach event listener to new input
                document.getElementById('designFiles').addEventListener('change', arguments.callee);
            }
        });
    }

    // Form submission
    const cakeQuoteForm = document.getElementById('cakeQuoteForm');
    if (cakeQuoteForm) {
        cakeQuoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate required fields
            if (!validateForm()) {
                return;
            }
            
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
                
                // Show success message with animation
                showSuccessMessage(`¡Formulario enviado exitosamente! 🎉\n\nCotización estimada: $${estimatedPrice} MXN\n\nRecibirás la cotización final en las próximas 24 horas.`);
            } else {
                showSuccessMessage('¡Formulario enviado exitosamente! 🎉\n\nRecibirás la cotización final en las próximas 24 horas.');
            }
            
            // Here you would typically send the form data to your server
            // sendFormData(new FormData(this));
        });
    }

    // Set minimum date to today
    const deliveryDateInput = document.getElementById('deliveryDate');
    if (deliveryDateInput) {
        deliveryDateInput.min = new Date().toISOString().split('T')[0];
    }
    
    // Real-time price calculation
    const guestsInput = document.getElementById('guests');
    const flavorInputs = document.querySelectorAll('input[name="flavor"]');
    
    function updatePriceEstimate() {
        const guests = parseInt(guestsInput?.value || 0);
        const selectedFlavor = document.querySelector('input[name="flavor"]:checked');
        
        if (guests && selectedFlavor) {
            const pricePerPerson = {
                'vainilla': 25,
                'chocolate': 30,
                'fresa': 35,
                'redvelvet': 40,
                'zanahoria': 38,
                'limon': 32
            };
            
            const estimatedPrice = guests * pricePerPerson[selectedFlavor.value];
            showPriceEstimate(estimatedPrice);
        } else {
            hidePriceEstimate();
        }
    }
    
    if (guestsInput) {
        guestsInput.addEventListener('input', updatePriceEstimate);
    }
    
    flavorInputs.forEach(input => {
        input.addEventListener('change', updatePriceEstimate);
    });
    
    // Form validation
    function validateForm() {
        let isValid = true;
        const requiredInputs = document.querySelectorAll('input[required], select[required]');
        
        // Remove previous error states
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            }
        });
        
        // Check if flavor is selected
        const flavorSelected = document.querySelector('input[name="flavor"]:checked');
        if (!flavorSelected) {
            document.querySelector('.flavor-grid').classList.add('error');
            isValid = false;
        }
        
        // Check if agreement is checked
        const agreement = document.getElementById('agreement');
        if (agreement && !agreement.checked) {
            agreement.parentElement.classList.add('error');
            isValid = false;
        }
        
        if (!isValid) {
            showErrorMessage('Por favor, completa todos los campos obligatorios marcados con *');
        }
        
        return isValid;
    }
    
    // Show price estimate
    function showPriceEstimate(price) {
        let estimateDiv = document.querySelector('.price-estimate');
        if (!estimateDiv) {
            estimateDiv = document.createElement('div');
            estimateDiv.className = 'price-estimate';
            estimateDiv.style.cssText = `
                position: fixed;
                top: 50%;
                right: 30px;
                transform: translateY(-50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 16px;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
                z-index: 1000;
                transition: all 0.3s ease;
                opacity: 0;
                transform: translateY(-50%) translateX(100px);
            `;
            document.body.appendChild(estimateDiv);
        }
        
        estimateDiv.innerHTML = `
            <div style="text-align: center;">
                <h4 style="margin-bottom: 8px; font-size: 14px; opacity: 0.9;">Estimación</h4>
                <div style="font-size: 24px; font-weight: 700;">$${price}</div>
                <div style="font-size: 12px; opacity: 0.8;">MXN</div>
            </div>
        `;
        
        setTimeout(() => {
            estimateDiv.style.opacity = '1';
            estimateDiv.style.transform = 'translateY(-50%) translateX(0)';
        }, 100);
    }
    
    function hidePriceEstimate() {
        const estimateDiv = document.querySelector('.price-estimate');
        if (estimateDiv) {
            estimateDiv.style.opacity = '0';
            estimateDiv.style.transform = 'translateY(-50%) translateX(100px)';
        }
    }
    
    // Show success message
    function showSuccessMessage(message) {
        const successModal = document.createElement('div');
        successModal.className = 'success-modal';
        successModal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content success">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>¡Éxito!</h3>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <button class="modal-btn" onclick="this.closest('.success-modal').remove()">
                        Entendido
                    </button>
                </div>
            </div>
        `;
        
        // Add modal styles
        addModalStyles();
        
        document.body.appendChild(successModal);
        
        // Show with animation
        setTimeout(() => {
            successModal.classList.add('show');
        }, 100);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successModal.parentNode) {
                successModal.remove();
            }
        }, 5000);
    }
    
    // Show error message
    function showErrorMessage(message) {
        const errorModal = document.createElement('div');
        errorModal.className = 'error-modal';
        errorModal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content error">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button class="modal-btn" onclick="this.closest('.error-modal').remove()">
                        Entendido
                    </button>
                </div>
            </div>
        `;
        
        addModalStyles();
        document.body.appendChild(errorModal);
        
        setTimeout(() => {
            errorModal.classList.add('show');
        }, 100);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (errorModal.parentNode) {
                errorModal.remove();
            }
        }, 3000);
    }
    
    // Add modal styles
    function addModalStyles() {
        if (document.querySelector('#quote-modal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'quote-modal-styles';
        styles.textContent = `
            .success-modal, .error-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .success-modal.show, .error-modal.show {
                opacity: 1;
            }
            
            .modal-content {
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            }
            
            .success-modal.show .modal-content,
            .error-modal.show .modal-content {
                transform: scale(1);
            }
            
            .success-icon, .error-icon {
                font-size: 60px;
                margin-bottom: 20px;
            }
            
            .success-icon {
                color: #10b981;
            }
            
            .error-icon {
                color: #ef4444;
            }
            
            .modal-content h3 {
                margin-bottom: 15px;
                color: #1f2937;
            }
            
            .modal-content p {
                margin-bottom: 25px;
                color: #6b7280;
                line-height: 1.6;
            }
            
            .modal-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .modal-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            }
            
            .error {
                border-color: #ef4444 !important;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
            }
            
            .flavor-grid.error {
                border: 2px solid #ef4444;
                border-radius: 16px;
                padding: 20px;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    // Enhanced form interactions
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.parentElement.classList.add('filled');
            } else {
                this.parentElement.classList.remove('filled');
            }
        });
        
        // Remove error state on input
        input.addEventListener('input', function() {
            this.classList.remove('error');
            this.parentElement.classList.remove('error');
        });
    });
    
    // Flavor selection animation
    const flavorOptions = document.querySelectorAll('.flavor-option');
    flavorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            flavorOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                updatePriceEstimate();
            }
        });
    });
    
    // Progressive form completion indicator
    function updateProgressIndicator() {
        const totalFields = document.querySelectorAll('input[required], select[required]').length;
        const completedFields = document.querySelectorAll('input[required]:valid, select[required]:valid').length;
        const flavorSelected = document.querySelector('input[name="flavor"]:checked') ? 1 : 0;
        const agreementChecked = document.getElementById('agreement')?.checked ? 1 : 0;
        
        const totalRequired = totalFields + 1 + 1; // +1 for flavor, +1 for agreement
        const totalCompleted = completedFields + flavorSelected + agreementChecked;
        const progress = (totalCompleted / totalRequired) * 100;
        
        let progressBar = document.querySelector('.progress-indicator');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress-indicator';
            progressBar.style.cssText = `
                position: fixed;
                top: 80px;
                left: 0;
                right: 0;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                z-index: 999;
            `;
            
            const progressFill = document.createElement('div');
            progressFill.className = 'progress-fill';
            progressFill.style.cssText = `
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                width: 0%;
                transition: width 0.3s ease;
            `;
            
            progressBar.appendChild(progressFill);
            document.body.appendChild(progressBar);
        }
        
        const progressFill = progressBar.querySelector('.progress-fill');
        progressFill.style.width = progress + '%';
    }
    
    // Update progress on any input change
    document.addEventListener('input', updateProgressIndicator);
    document.addEventListener('change', updateProgressIndicator);
    
    // Initialize progress
    updateProgressIndicator();
    
    // Auto-save form data to localStorage
    function saveFormData() {
        const formData = new FormData(cakeQuoteForm);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        localStorage.setItem('cakeQuoteFormData', JSON.stringify(data));
    }
    
    function loadFormData() {
        const savedData = localStorage.getItem('cakeQuoteFormData');
        if (savedData) {
            const data = JSON.parse(savedData);
            for (let [key, value] of Object.entries(data)) {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'radio') {
                        const radio = document.querySelector(`[name="${key}"][value="${value}"]`);
                        if (radio) radio.checked = true;
                    } else if (input.type === 'checkbox') {
                        input.checked = value === 'on';
                    } else {
                        input.value = value;
                    }
                }
            }
            updateProgressIndicator();
            updatePriceEstimate();
        }
    }
    
    // Load saved data on page load
    loadFormData();
    
    // Save data on input change
    document.addEventListener('input', saveFormData);
    document.addEventListener('change', saveFormData);
    
    // Clear saved data on successful submission
    cakeQuoteForm?.addEventListener('submit', function() {
        localStorage.removeItem('cakeQuoteFormData');
    });
});

// Utility function to send form data to server
function sendFormData(formData) {
    // This would be implemented based on your backend setup
    // Example using fetch API:
    /*
    fetch('/submit-quote', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    */
}
