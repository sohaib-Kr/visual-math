// GSAP setup and initialization
const { gsap, Flip } = window;
gsap.registerPlugin(Flip);

// Global DOM elements that are shared across all card animations
const globalElements = {
    boxTarget: document.querySelector('#boxTarget'),  // Target container for expanded card
    container: document.querySelector('#main-container'),  // Main container for layout calculations
}

// Store all animations
const animations = {
    // Card animations
    image: {
        borderRadius: '100%',
        aspectRatio: 1,
        scale: 0.8,
        backgroundColor: 'blue',
        duration: 0.5
    },
    background: {
        duration: 0.5,
        ease: "power1.inOut"
    },
    flip: {
        duration: 0.5,
        ease: "power1.inOut",
        absolute: true,
        scale: true,
    },
    button: {
        x: -40,
        duration: 0.5,
        ease: 'power1.inOut'
    },
    subsection: {
        opacity: 1,
        display: 'flex',
        duration: 0.5,
        ease: 'power1.inOut'
    },
    // Text animations
    buttonText: {
        opacity: 0,
        duration: 0.3,
        ease: 'power1.inOut'
    },
    title: {
        opacity: 0,
        duration: 0.3,
        ease: "power1.inOut"
    },
    // Other cards fade
    otherCards: {
        opacity: 0,
        duration: 0.3,
        ease: "power1.inOut"
    }
}

/**
 * CardAnimator class - Handles all animations and interactions for a single card
 * @param {number} id - Unique identifier for the card
 */
function CardAnimator(id) {
    // Get the main card element and its child elements
    let elem = document.getElementById('card' + id);
    let elements = {
        image: elem.querySelector('.card-image'),
        button: elem.querySelector('.card-button'),
        returnButton: elem.querySelector('card-button'),
        background: elem.querySelector('.card-background'),
        content: elem.querySelector('.card-content'),
        title: elem.querySelector('.card-title'),
        subsection: document.querySelector('#subsection-container' + id)  // Associated subsection container
    }

    /**
     * Calculates the position and scale needed for the background to cover the container
     * @returns {Object} Object containing x, y positions and scale values
     */
    const calculateCoverPosition = () => {
        const containerRect = globalElements.container.getBoundingClientRect();
        const cardRect = elements.background.getBoundingClientRect();
        
        // Calculate offset to move to container's top-left
        const moveX = containerRect.left - cardRect.left;
        const moveY = containerRect.top - cardRect.top;
        
        // Calculate scale needed to cover container (with slight padding)
        const scaleX = containerRect.width / cardRect.width + 0.1;
        const scaleY = containerRect.height / cardRect.height + 0.1;
        
        return { x: moveX - 20, y: moveY - 20, scaleX, scaleY };
    }

    // Create tweens with their targets
    animations.background = calculateCoverPosition();
    const tweens = {
        image: gsap.to(elements.image, animations.image).pause(),
        background: gsap.to(elements.background, animations.background).pause(),
        button: gsap.to(elements.button, animations.button).pause(),
        subsection: gsap.to(elements.subsection, animations.subsection).pause(),
        buttonText: gsap.to(elements.button.children[0], animations.buttonText).pause(),
        title: gsap.to(elements.title, animations.title).pause(),
        otherCards: gsap.to(document.querySelectorAll('.card'), animations.otherCards).pause()  // Empty array, will be set during animation
    }
    let handleBoxTransition, handleBoxTransition2;

    /**
     * Handles the expansion animation when clicking "View"
     */
    handleBoxTransition = () => {
        // Get initial state for FLIP animation
        const state = Flip.getState(elements.content);
        globalElements.boxTarget.appendChild(elements.content);
        Flip.from(state, animations.flip);

        // Fade out other cards
        const otherCards = [...document.querySelectorAll('.card')].filter(card => card !== elem);
        tweens.otherCards.play();
        
        // Show and animate subsection
        tweens.subsection.play();
        
        // Run all animations
        tweens.image.play();
        tweens.background.play();
        tweens.button.play();
        
        // Update button text and event listeners
        elements.button.removeEventListener('click', handleBoxTransition);
        tweens.buttonText.play().then(() => {
            elements.button.children[0].innerHTML = 'Close';
            elements.button.addEventListener('click', handleBoxTransition2);
            tweens.buttonText.reverse();
        });

        // Fade out title
        tweens.title.play();
    }

    /**
     * Handles the collapse animation when clicking "Close"
     */
    handleBoxTransition2 = () => {
        const state = Flip.getState(elements.content);
        elem.appendChild(elements.content);
        
        // Fade in other cards
        const otherCards = [...document.querySelectorAll('.card')].filter(card => card !== elem);
        gsap.to(otherCards, {
            ...animations.otherCards,
            opacity: 1
        });

        // Reverse all animations
        tweens.image.reverse();
        tweens.background.reverse();
        tweens.button.reverse();
        tweens.subsection.reverse();
        Flip.from(state, animations.flip);
        
        // Update button text and event listeners
        elements.button.removeEventListener('click', handleBoxTransition2);
        tweens.buttonText.play().then(() => {
            elements.button.children[0].innerHTML = 'View';
            elements.button.addEventListener('click', handleBoxTransition);
            tweens.buttonText.reverse();
        });

        // Fade in title
        tweens.title.reverse();
    }

    // Initialize click event listener
    elements.button.addEventListener('click', handleBoxTransition);
}

/**
 * Generates HTML for section cards
 * @param {Array} data - Array of section data
 * @returns {string} HTML string for section cards
 */
function sectionParser(data) {
    let str = ``
    data.forEach((element, index) => {
        str = str + `<article class="card w-[calc(25%-16px)] m-6 h-[400px] min-w-[200px] aspect-[4/5] grid relative " id="card${index}">
                <div class="card-background w-full h-full overlap bg-radial from-[#ff8a94] to-[#b15a84] rounded-lg shadow-md origin-top-left"></div>
                <div class="card-content w-full h-full overlap grid grid-rows-[80%_20%] p-2">
                    <div class="card-image w-[97%] justify-self-center bg-pink-200 rounded-[15px] h-full">
                    <img alt="${element.title}" class="w-full h-full object-cover rounded-[15px]">
                    </div>
                    <div class="flex flex-row items-center justify-between gap-2">
                        <h2 class="card-title text-white text-2xl font-bold px-2 tracking-wide drop-shadow-sm hover:scale-105 transition-transform">${element.title}</h2>
                        <button class="card-button relative right-6 bg-white px-6 h-12 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 hover:shadow-sm transition-all duration-200 cursor-pointer">
                            <span>View</span>
                        </button>
                    </div>
                </div>
            </article>`
    });
    return str;
}

/**
 * Generates HTML for subsection cards
 * @param {Array} data - Array of subsection data
 * @returns {string} HTML string for subsection cards
 */
function subsectionParser(data) {
    let str = ``
    data.forEach((element, index) => {
        str = str + `<article class="sub-section-card w-[calc(25%-16px)] m-6 h-[450px] min-w-[200px] aspect-[4/5] grid relative" id="subsection-card${index}">
                <div class="card-background w-full h-full overlap bg-radial from-[#ff8a94] to-[#b15a84] rounded-lg shadow-md origin-top-left"></div>
                <div class="card-content w-full h-full overlap grid grid-rows-[65%_10%_25%] p-2">
                    <div class="card-image w-[97%] justify-self-center bg-pink-200 rounded-[15px] h-full">
                        <img  alt="${element.title}" class="w-full h-full object-cover rounded-[15px]">
                    </div>
                    <h2 class="card-title text-white text-xl font-bold px-2 tracking-wide drop-shadow-sm ">${element.title}</h2>
                    <div class="flex flex-col justify-between">
                        <p class="card-description text-white text-sm px-2 line-clamp-2">${element.description}</p>
                        <button class="card-button justify-self-center bg-white px-6 h-10 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 hover:shadow-sm transition-all duration-200 cursor-pointer self-end">
                            <span>View</span>
                        </button>
                    </div>
                </div>
            </article>`
    });
    return str;
}

// Initialize the page with sections and subsections
document.getElementById('main-container').children[0].innerHTML = sectionParser(sections)
document.getElementById('main-container').children[1].innerHTML = subsectionParser(subSections)

// Initialize animations for all cards
CardAnimator(0)
CardAnimator(1) 
CardAnimator(2)
CardAnimator(3)