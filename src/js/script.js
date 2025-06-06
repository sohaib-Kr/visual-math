import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// GSAP setup and initialization
gsap.registerPlugin(Flip, ScrollTrigger);

// Set default GSAP properties
gsap.defaults({
    duration: 0.5,
    ease: "power1.inOut"
});

// Global DOM elements that are shared across all card animations
const globalElements = {
    boxTarget: document.querySelector('#boxTarget'),  // Target container for expanded card
    container: document.querySelector('#main-container'),  // Main container for layout calculations
}

var initialScrollPosition
// Store all animations
const animations = {
    // Card animations
    image: {
        borderRadius: '100%',
        aspectRatio: 1,
        scale: 0.8,
        backgroundColor: 'blue',
    },
    flip: {
        absolute: true,
        scale: true,
    },
    button: {
        x: -40,
    },
    subsection: {
        opacity: 1,
        display: 'flex',
    },
    // Text animations
    buttonText: {
        opacity: 0,
    },
    title: {
        opacity: 0,
    },
    // Other cards fade
    otherCards: {
        opacity: 0,
        y:50
    }
}

/**
 * CardAnimator class - Handles all animations and interactions for a single card
 * @param {number} id - Unique identifier for the card
 */
function cardAnimator(id) {
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
        otherCards:gsap.to([...document.querySelectorAll('.card')].filter(card => card !== elem), animations.otherCards).pause() 
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
        tweens.background.play()
        tweens.subsection.play()

        
        // Run all animations
        tweens.image.play();
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
        initialScrollPosition={top:window.scrollY,left:0,behavior:'smooth'}
        
    console.log(initialScrollPosition)
        window.scrollTo({
            top:0,
            left:0,
            behavior:'smooth'
        })
    }

    /**
     * Handles the collapse animation when clicking "Close"
     */
    handleBoxTransition2 = () => {
        const state = Flip.getState(elements.content);
        elem.appendChild(elements.content);
        
        // Fade in other cards
        const otherCards = [...document.querySelectorAll('.card')];
        tweens.otherCards.reverse();

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
        window.scrollTo(initialScrollPosition)
    }

    // Initialize click event listener
    elements.button.addEventListener('click', handleBoxTransition);
}






// Initialize the page with sections and subsections

// cardAnimator(0)
// cardAnimator(1)
// cardAnimator(2)
// cardAnimator(3)

















