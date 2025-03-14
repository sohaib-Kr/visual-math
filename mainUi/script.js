// GSAP setup and initialization
const { gsap, Flip, ScrollTrigger } = window;
gsap.registerPlugin(Flip, ScrollTrigger);

// Set default GSAP properties
gsap.defaults({
    duration: 2,
    ease: "power1.inOut"
});

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
        console.log([...document.querySelectorAll('.card')].filter(card => card !== elem))
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
    }

    // Initialize click event listener
    elements.button.addEventListener('click', handleBoxTransition);
}






// Initialize the page with sections and subsections
document.getElementById('main-container').children[0].innerHTML = sectionParser(sections)
document.getElementById('main-container').children[1].innerHTML = subsectionParser(subSections)

cardAnimator(0)
cardAnimator(1)
cardAnimator(2)
cardAnimator(3)

















function progressBar(){
    // Create SVG canvas for progress bar
    const draw = SVG().addTo(document.getElementById('progress-bar')).size('100%', '100%');
    const rectData={
        x:50,
        y:50,
        width:20,
        height:600,
    }
    const barSkeleton=draw.path(`M ${rectData.x} ${rectData.y} 
        A 1 1 0 0 1 ${rectData.x+rectData.width} ${rectData.y} 
        V ${rectData.height + rectData.y} 
        A 1 1 0 0 1 ${rectData.x} ${rectData.height + rectData.y} Z`)
    .fill('#f6f3f4')
    const barCurrent=draw.path(`M ${rectData.x} ${rectData.y} 
        A 1 1 0 0 1 ${rectData.x+rectData.width} ${rectData.y} 
        V ${rectData.y} 
        A 1 1 0 0 1 ${rectData.x} ${rectData.y} Z`)
    .fill('#b15a84')

    // Create ScrollTrigger animation for progress bar
    gsap.to(barCurrent.node, {
        scrollTrigger: {
            trigger: "#parts-container",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin:draw.node,
        },
    });
    const points=[]
    Array.from(document.getElementById('parts-container').children).forEach((child,index)=>{
        points.push({
            height:parseInt(parseInt(window.getComputedStyle(child).height)),
            title:child.getAttribute('data-title')
        })
    })
    let totalHeight=0
    let currentHeight=0
    points.forEach((point)=>totalHeight+=point.height)
    points.forEach((point,index)=>{
        point.circle=draw.circle(30).fill('#f6f3f4')
        .center(rectData.x+10,rectData.y+rectData.height*(currentHeight/totalHeight))
        point.text=draw.text(point.title).font({size:15,weight:'bold'})
        .fill('#bfbfbf')
        .cy(rectData.y+rectData.height*(currentHeight/totalHeight))
        .x(rectData.x+40)
        console.log((point.height/totalHeight))
        currentHeight+=point.height
    })
    currentHeight=0
    let lastHeight=0
    points.forEach((point,index)=>{
        ScrollTrigger.create({
            trigger:document.getElementsByClassName('part')[index],
            start: "top 50%",
            end: "bottom 50%",
            onEnter:()=>{
                point.circle.fill('#b15a84')
                point.text.fill('#595959')
                gsap.timeline().to(point.circle.node,{scale:1.2,x:-3,duration:0.3}).to(point.circle.node,{scale:1,x:0,duration:0.3})
            },
            onLeaveBack:()=>{
                point.circle.fill('#f6f3f4')
                point.text.fill('#bfbfbf')
                lastHeight-=point.height
            },
            onLeave:()=>{
                index<points.length-1 ? lastHeight+=point.height : NaN
            },
            onEnterBack:()=>{
                index==0 ? lastHeight=0 : NaN
            },
            onUpdate: (self) => {
                // Calculate new height based on scroll progress
                const newheight = rectData.height*((point.height*self.progress+lastHeight)/totalHeight)-20;
                
                // Update progress bar path
                barCurrent.plot(`M ${  rectData.x} ${ rectData.y} 
                    A 1 1 0 0 1 ${ rectData.x+   rectData.width} ${  rectData.y} 
                    V ${newheight + rectData.y} 
                    A 1 1 0 0 1 ${ rectData.x} ${newheight + rectData.y} Z`);
                },
        })
    })
}



//single page animations
// progressBar()
Array.from(document.getElementsByClassName('fadeOnScroll')).forEach((element)=>{
    ScrollTrigger.create({
        trigger:element,
        start: "top 75%",
        onEnter:()=>{
            gsap.to(element,{opacity:1,y:-20,duration:0.8})
        },
        onLeaveBack:()=>{
            gsap.to(element,{opacity:0,y:20,duration:0.8})
        },
        
    })
})
