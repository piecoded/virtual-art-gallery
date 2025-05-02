// Art collection data
const artCollection = [
    {
        id: 1,
        title: "Starry Night",
        artist: "Vincent van Gogh",
        year: "1889",
        description: "This painting depicts the view from the east-facing window of Van Gogh's asylum room at Saint-Rémy-de-Provence, just before sunrise, with the addition of an imaginary village.",
        image: "images/starry_night.jpg"
    },
    {
        id: 2,
        title: "The Persistence of Memory",
        artist: "Salvador Dalí",
        year: "1931",
        description: "One of the most recognizable works of Surrealism, it depicts melting pocket watches in a desert landscape.",
        image: "images/persistence_of_memory.jpg"
    },
    {
        id: 3,
        title: "Girl with a Pearl Earring",
        artist: "Johannes Vermeer",
        year: "1665",
        description: "This work has been referred to as the 'Dutch Mona Lisa', or the 'Mona Lisa of the North'. It depicts a European girl wearing an exotic dress and an oriental turban.",
        image: "images/girl_with_pearl_earring.jpg"
    },
    {
        id: 4,
        title: "The Scream",
        artist: "Edvard Munch",
        year: "1893",
        description: "The painting shows a figure with an agonized expression against a landscape with a tumultuous orange sky. It symbolizes the anxiety of the human condition.",
        image: "images/the_scream.jpg"
    },
    {
        id: 5,
        title: "Water Lilies",
        artist: "Claude Monet",
        year: "1919",
        description: "Part of Monet's Water Lilies series, this painting depicts his flower garden at his home in Giverny, and is the main focus of his artistic production during the last thirty years of his life.",
        image: "images/water_lilies.jpg"
    },
    {
        id: 6,
        title: "The Night Watch",
        artist: "Rembrandt van Rijn",
        year: "1642",
        description: "This painting is renowned for its effective use of light and shadow, as well as the perception of motion in what would have traditionally been a static military group portrait.",
        image: "images/night_watch.jpg"
    },
    {
        id: 7,
        title: "School of Athens",
        artist: "Raphael",
        year: "1509–1511",
        description: "A celebrated fresco representing philosophy, it features great thinkers like Plato and Aristotle. The work is a masterpiece of Renaissance art and ideal for exploring classical knowledge and harmony.",
        image: "images/school-of-athens.jpg"
    },
    {
        id: 8,
        title: "Composition VIII",
        artist: "Wassily Kandinsky",
        year: "1923",
        description: "An abstract composition of geometric forms and vibrant colors, reflecting Kandinsky’s interest in spirituality, music, and synesthesia in art.",
        image: "images/composition.jpg"
    }
    
];

// DOM Elements
const galleryGrid = document.getElementById('gallery-grid');
const exhibitView = document.getElementById('exhibit-view');
const currentArtwork = document.getElementById('current-artwork');
const artworkTitle = document.getElementById('artwork-title');
const artworkArtist = document.getElementById('artwork-artist');
const artworkYear = document.getElementById('artwork-year');
const artworkDescription = document.getElementById('artwork-description');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const galleryViewBtn = document.getElementById('gallery-view-btn');
const zoomView = document.getElementById('zoom-view');
const zoomArtwork = document.getElementById('zoom-artwork');
const closeZoomBtn = document.getElementById('close-zoom-btn');

// State variables
let currentArtworkIndex = 0;
let isDragging = false;
let startPos = { x: 0, y: 0 };
let currentPos = { x: 0, y: 0 };

// Initialize the gallery
function initGallery() {
    // Generate gallery thumbnails
    artCollection.forEach((artwork, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'artwork-thumbnail';
        thumbnail.innerHTML = `
            <img src="${artwork.image}" alt="${artwork.title}">
            <div class="thumbnail-info">
                <h3>${artwork.title}</h3>
                <p>${artwork.artist}</p>
            </div>
        `;
        thumbnail.addEventListener('click', () => {
            showExhibit(index);
        });
        galleryGrid.appendChild(thumbnail);
    });

    // Set up navigation buttons
    prevBtn.addEventListener('click', showPreviousArtwork);
    nextBtn.addEventListener('click', showNextArtwork);
    galleryViewBtn.addEventListener('click', showGalleryView);
    
    // Set up zoom functionality
    currentArtwork.addEventListener('click', enableZoom);
    closeZoomBtn.addEventListener('click', disableZoom);
    
    // Set up zoom dragging
    zoomArtwork.addEventListener('mousedown', startDrag);
    zoomArtwork.addEventListener('touchstart', startDrag, { passive: false });
    
    window.addEventListener('mousemove', drag);
    window.addEventListener('touchmove', drag, { passive: false });
    
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    
    // Initialize with gallery view
    updateNavButtons();
}

// Show the exhibit view with the selected artwork
function showExhibit(index) {
    currentArtworkIndex = index;
    const artwork = artCollection[index];
    
    // Update the exhibit view with artwork details
    currentArtwork.src = artwork.image;
    artworkTitle.textContent = artwork.title;
    artworkArtist.textContent = artwork.artist;
    artworkYear.textContent = artwork.year;
    artworkDescription.textContent = artwork.description;
    
    // Show exhibit view, hide gallery grid
    galleryGrid.classList.add('hidden');
    exhibitView.classList.remove('hidden');
    
    updateNavButtons();
}

// Show the previous artwork
function showPreviousArtwork() {
    if (currentArtworkIndex > 0) {
        showExhibit(currentArtworkIndex - 1);
    }
}

// Show the next artwork
function showNextArtwork() {
    if (currentArtworkIndex < artCollection.length - 1) {
        showExhibit(currentArtworkIndex + 1);
    }
}

// Return to gallery view
function showGalleryView() {
    exhibitView.classList.add('hidden');
    galleryGrid.classList.remove('hidden');
}

// Update navigation button states
function updateNavButtons() {
    prevBtn.disabled = currentArtworkIndex === 0;
    nextBtn.disabled = currentArtworkIndex === artCollection.length - 1;
}

// Enable zoom view
function enableZoom() {
    zoomArtwork.src = artCollection[currentArtworkIndex].image;
    zoomView.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Reset transform
    zoomArtwork.style.transform = 'translate(0, 0)';
}

// Disable zoom view
function disableZoom() {
    zoomView.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

// Start dragging the zoomed image
function startDrag(e) {
    isDragging = true;
    
    // Get initial position
    if (e.type === 'mousedown') {
        startPos.x = e.clientX;
        startPos.y = e.clientY;
    } else if (e.type === 'touchstart') {
        e.preventDefault();
        startPos.x = e.touches[0].clientX;
        startPos.y = e.touches[0].clientY;
    }
    
    // Get current transform values
    const transform = zoomArtwork.style.transform;
    const matrix = new DOMMatrix(transform || 'translate(0, 0)');
    currentPos.x = matrix.e;
    currentPos.y = matrix.f;
    
    zoomArtwork.style.cursor = 'grabbing';
}

// Drag the zoomed image
function drag(e) {
    if (!isDragging) return;
    
    let moveX, moveY;
    
    if (e.type === 'mousemove') {
        moveX = e.clientX - startPos.x;
        moveY = e.clientY - startPos.y;
    } else if (e.type === 'touchmove') {
        e.preventDefault();
        moveX = e.touches[0].clientX - startPos.x;
        moveY = e.touches[0].clientY - startPos.y;
    }
    
    // Apply the new transform
    const newX = currentPos.x + moveX;
    const newY = currentPos.y + moveY;
    zoomArtwork.style.transform = `translate(${newX}px, ${newY}px)`;
}

// End dragging
function endDrag() {
    isDragging = false;
    zoomArtwork.style.cursor = 'move';
}

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (exhibitView.classList.contains('hidden')) return;
    
    switch (e.key) {
        case 'ArrowLeft':
            showPreviousArtwork();
            break;
        case 'ArrowRight':
            showNextArtwork();
            break;
        case 'Escape':
            if (!zoomView.classList.contains('hidden')) {
                disableZoom();
            } else {
                showGalleryView();
            }
            break;
    }
});

// Initialize the gallery when the page loads
window.addEventListener('load', initGallery);