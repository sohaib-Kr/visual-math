// GSAP setup
const { gsap, Flip } = window;
gsap.registerPlugin(Flip);

// DOM Elements
const globalElements={
    boxTarget: document.querySelector('#boxTarget'),
    container: document.querySelector('#main-container'),
}

function CardAnimator(id){
    let elem=document.getElementById('card'+id);
    let elements={
        image: elem.querySelector('.card-image'),
        button: elem.querySelector('.card-button'),
        returnButton: elem.querySelector('card-button'),
        background: elem.querySelector('.card-background'),
        content: elem.querySelector('.card-content'),
    }

    // Calculate position and scale for covering container
    const calculateCoverPosition = () => {
        const containerRect = globalElements.container.getBoundingClientRect();
        const cardRect = elements.background.getBoundingClientRect();
        
        // Calculate the position to move to container's top-left
        const moveX = containerRect.left - cardRect.left;
        const moveY = containerRect.top - cardRect.top;
        
        // Calculate the scale needed to cover the container
        const scaleX = containerRect.width / cardRect.width;
        const scaleY = containerRect.height / cardRect.height;
        
        return { x:moveX, y:moveY, scaleX, scaleY };
    }

    const animations = {
        image: {
            borderRadius: '100%',
            aspectRatio: 1,
            scale: 0.8,
            backgroundColor: 'blue',
            duration: 0.5
        },
        background: {
            duration: 0.5,
            ease: "power1.inOut",
            ...calculateCoverPosition()
        },
        flip: {
            duration: 0.5,
            ease: "power1.inOut",
            absolute: true
        },
        button: {
            x: -40,
            duration: 0.5,
            ease: 'power1.inOut'
        }
    }
    
    let backtween, boxtween, buttontween;
    let handleBoxTransition, handleBoxTransition2;

    handleBoxTransition = () => {
        const state = Flip.getState(elements.content);
        globalElements.boxTarget.appendChild(elements.content);
        Flip.from(state, animations.flip);

        // Fade out other cards
        const otherCards = [...document.querySelectorAll('.card')].filter(card => card !== elem);
        gsap.to(otherCards, {
            opacity: 0,
            duration: 0.3,
            ease: "power1.inOut"
        });

        boxtween = gsap.to(elements.image, animations.image);
        backtween = gsap.to(elements.background, animations.background);
        buttontween = gsap.to(elements.button, animations.button);
        elements.button.removeEventListener('click', handleBoxTransition);

        let text = elements.button.children[0];
        gsap.to(text, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                text.innerHTML = 'Close';
                elements.button.addEventListener('click', handleBoxTransition2);
                gsap.to(text, {opacity: 1, duration: 0.3});
            }
        });
    }

    handleBoxTransition2 = () => {
        const state = Flip.getState(elements.content);
        elem.appendChild(elements.content);
        
        // Fade in other cards
        const otherCards = [...document.querySelectorAll('.card')].filter(card => card !== elem);
        gsap.to(otherCards, {
            opacity: 1,
            duration: 0.3,
            ease: "power1.inOut"
        });

        boxtween.reverse();
        backtween.reverse();
        buttontween.reverse();
        Flip.from(state, animations.flip);
        
        let text = elements.button.children[0];
        elements.button.removeEventListener('click', handleBoxTransition2);
        gsap.to(text, {
            opacity: 0,
            duration: 0.5,
            ease: 'power1.inOut',
            onComplete: () => {
                text.innerHTML = 'View';
                elements.button.addEventListener('click', handleBoxTransition);
                gsap.to(text, {opacity: 1, duration: 0.3});
            }
        });
    }
    elements.button.addEventListener('click', handleBoxTransition);
}

CardAnimator(1);CardAnimator(2);CardAnimator(3);CardAnimator(4);CardAnimator(5);
