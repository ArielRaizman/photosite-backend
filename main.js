// Global variables
let imageData = [];
let currentImageIndex = -1;
let filteredImages = [];
const baseImagePath = '../assets';

// Load the JSON data when the page loads
window.addEventListener('load', async () => {
    try {
        const response = await fetch('image-data.json');
        imageData = await response.json();
        filteredImages = [...imageData];
        updateResultsList();
    } catch (error) {
        console.error('Error loading image data:', error);
        alert('Error loading image data. Please check the console for details.');
    }
});

// Search functionality
const searchField = document.getElementById('searchField');
const searchValue = document.getElementById('searchValue');

searchValue.addEventListener('input', () => {
    const field = searchField.value;
    const value = searchValue.value.toLowerCase();
    
    if (value === '') {
        filteredImages = [...imageData];
    } else {
        filteredImages = imageData.filter(img => {
            const fieldValue = (img[field] || '').toLowerCase();
            return fieldValue.includes(value);
        });
    }
    
    updateResultsList();
});

// Update the results list in the UI
function updateResultsList() {
    const resultsList = document.getElementById('resultsList');
    resultsList.innerHTML = '';
    
    filteredImages.forEach((img, index) => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.textContent = img.image_name;
        div.addEventListener('click', () => {
            currentImageIndex = index;
            displayImage(img);
        });
        resultsList.appendChild(div);
    });
    
    // If we have results and no image is selected, display the first one
    if (filteredImages.length > 0 && currentImageIndex === -1) {
        currentImageIndex = 0;
        displayImage(filteredImages[0]);
    }
}

// Display the selected image and its metadata
function displayImage(imageInfo) {
    const preview = document.getElementById('imagePreview');
    const imagePath = `${baseImagePath}\\${imageInfo.location}\\${imageInfo.image_name}`;
    preview.src = imagePath;
    
    // Update form fields
    document.getElementById('image_name').value = imageInfo.image_name || '';
    document.getElementById('location').value = imageInfo.location || '';
    document.getElementById('title').value = imageInfo.title || '';
    document.getElementById('link').value = imageInfo.link || '';
}

// Navigation buttons
document.getElementById('prevButton').addEventListener('click', () => {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        displayImage(filteredImages[currentImageIndex]);
    }
});

document.getElementById('nextButton').addEventListener('click', () => {
    if (currentImageIndex < filteredImages.length - 1) {
        currentImageIndex++;
        displayImage(filteredImages[currentImageIndex]);
    }
});

// Save changes
document.getElementById('saveButton').addEventListener('click', async () => {
    if (currentImageIndex === -1) return;
    
    const currentImage = filteredImages[currentImageIndex];
    const formData = {
        image_name: document.getElementById('image_name').value,
        location: document.getElementById('location').value,
        title: document.getElementById('title').value,
        link: document.getElementById('link').value
    };
    
    // Update both the filtered and main arrays
    Object.assign(currentImage, formData);
    const mainIndex = imageData.findIndex(img => img.image_name === currentImage.image_name);
    if (mainIndex !== -1) {
        Object.assign(imageData[mainIndex], formData);
    }
    
    try {
        const response = await fetch('image-data.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(imageData, null, 2)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save changes');
        }
        
        alert('Changes saved successfully!');
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('Error saving changes. Please check the console for details.');
    }
});
