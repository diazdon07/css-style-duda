//80% Complete Usable and Running But Slow Checking
function ensurePageIsAtTop(callback) {
    if (window.scrollY !== 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            callback();
        }, 2000);
    } else {
        callback();
    }
}

function smoothScrollAndLoad() {
    let totalHeight = 0;
    const distance = 500;
    const delay = 700;

    function scrollStep() {
        totalHeight += distance;
        window.scrollBy(0, distance);
        if (totalHeight < document.body.scrollHeight) {
            setTimeout(scrollStep, delay);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            displayBackgroundImageSizes();
        }
    }

    scrollStep();
}

async function getImageSize(url) {
    // Skip SVG files to avoid CORS issues
    if (url.endsWith('.svg')) {
        console.warn(`Skipping SVG file: ${url}`);
        return null;
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
          	cache: 'no-cache'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const blob = await response.blob();
        const sizeInKB = blob.size / 1024;
        return sizeInKB.toFixed(2);
    } catch (error) {
        console.error(`Error fetching image: ${error}`);
        return null;
    }
}

function extractImageName(url) {
    const parts = url.split('/');
    return parts[parts.length - 1];
}

async function displayBackgroundImageSizes() {
    const allElements = document.querySelectorAll('div, a, img'); // Include img tags
    const delay = 500;
    const supportingImages = [];
    const bannerImages = [];

    // Helper function to extract image URLs from elements and pseudo-elements
    function getBackgroundImage(element, pseudo = null) {
        const bgImage = getComputedStyle(element, pseudo).backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const urlMatch = bgImage.match(/url\(["']?([^"']*)["']?\)/);
            return urlMatch ? urlMatch[1] : null;
        }
        return null;
    }

    for (const element of allElements) {
        let imageUrl = null;

        // Check for background image in element and its pseudo-elements
        imageUrl = getBackgroundImage(element) || getBackgroundImage(element, '::before') || getBackgroundImage(element, '::after');

        // For img tags, get the src attribute directly
        if (element.tagName.toLowerCase() === 'img') {
            imageUrl = element.src;
        }

        if (imageUrl) {
            await new Promise(resolve => setTimeout(resolve, delay));
            const sizeInKB = await getImageSize(imageUrl);
            
            if (sizeInKB !== null) {
                console.log(`Element: ${element.tagName}, Background Image URL: ${imageUrl}, Size: ${sizeInKB} KB`);

                const sizeDisplay = document.createElement('div');
                sizeDisplay.textContent = `Size: ${sizeInKB} KB`;
                sizeDisplay.style.cssText = 'position: absolute; background: rgba(255, 255, 255, 0.8); padding: 5px; border: 1px solid #000; z-index: 9999;';

                if (element.tagName.toLowerCase() === 'a' && parseFloat(sizeInKB) > 200) {
                    sizeDisplay.style.color = 'white';
                    sizeDisplay.style.backgroundColor = 'red';
                    supportingImages.push(extractImageName(imageUrl));
                }

                if (element.tagName.toLowerCase() === 'div' && parseFloat(sizeInKB) > 1000) {
                    sizeDisplay.style.color = 'white';
                    sizeDisplay.style.backgroundColor = 'red';
                    bannerImages.push(extractImageName(imageUrl));
                }

                document.body.appendChild(sizeDisplay);

                const rect = element.getBoundingClientRect();
                sizeDisplay.style.top = `${rect.bottom + window.scrollY}px`;
                sizeDisplay.style.left = `${rect.left + window.scrollX}px`;

                element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    if (supportingImages.length > 0) {
        console.log('Supporting Images over 200KB:');
        supportingImages.forEach(imageName => console.log(imageName));
    } else {
        console.log('No supporting images above 200KB found.');
    }

    if (bannerImages.length > 0) {
        console.log('Banner Images over 1MB:');
        bannerImages.forEach(imageName => console.log(imageName));
    } else {
        console.log('No banner images above 1MB found.');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

ensurePageIsAtTop(smoothScrollAndLoad);