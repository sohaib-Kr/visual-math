import gsap from "gsap";
export function emphasize(elements, options = {}) {
  // Handle single element case by converting to array
  const elems = Array.isArray(elements) ? elements : [elements];
  if (!elems.length || !elems[0].node) {
    console.error("Invalid elements provided to Emphasize()");
    return null;
  }

  const svg = elems[0].root();
  const highlightGroup = svg.group().addClass('emphasis-group');
  
  // Create shader covering entire SVG
  const svgBox = svg.bbox();
  const shader = svg.rect(svgBox.width, svgBox.height)
    .fill(options.shaderColor || 'black')
    .opacity(options.opacity !== undefined ? options.opacity : 0.3)
    .addTo(highlightGroup);

  // Store all element copies and their update functions
  const trackedElements = [];

  // Function to calculate cumulative transform
  const getCumulativeTransform = (element) => {
    let current = element.node;
    let matrix = svg.node.createSVGMatrix(); // Identity matrix
    
    while (current && current !== svg.node) {
      if (current.transform && current.transform.baseVal.numberOfItems > 0) {
        matrix = current.transform.baseVal.getItem(0).matrix.multiply(matrix);
      }
      current = current.parentNode;
    }
    return matrix;
  };

  // Function to copy event listeners from original to copy
  const copyEventListeners = (originalElem, copyElem) => {
    const originalNode = originalElem.node;
    const copyNode = copyElem.node;
    
    if (!originalNode._events) return; // No events attached
    
    // Get all event types registered on the original element
    const eventTypes = Object.keys(originalNode._events);
    
    eventTypes.forEach(eventType => {
      // Get all listeners for this event type
      const listeners = originalNode._events[eventType];
      
      listeners.forEach(listener => {
        // Add the same listener to the copy
        copyNode.addEventListener(eventType, listener.fn, listener);
      });
    });
  };

  // Function to position a copy
  const createPositionedCopy = (elem) => {
    let elemCopy = elem.clone().addTo(highlightGroup);
    const bbox = elem.bbox();
    
    const matrix = getCumulativeTransform(elem);
    const point = svg.node.createSVGPoint();
    point.x = bbox.x;
    point.y = bbox.y;
    const transformed = point.matrixTransform(matrix);
    elemCopy.move(transformed.x, transformed.y);
    
    elemCopy.attr({opacity:0});
    
    // Copy event listeners from original to copy
    copyEventListeners(elem, elemCopy);
    
    return {
      original: elem,
      copy: elemCopy,
      update: function() {
        if(elem.type === 'path'){
          const path = elem.attr('d');
          elemCopy.plot(path);
        }
        
        const newBbox = elem.bbox();
        const newMatrix = getCumulativeTransform(elem);
        point.x = newBbox.x;
        point.y = newBbox.y;
        const newTransformed = point.matrixTransform(newMatrix);
        elemCopy.move(newTransformed.x, newTransformed.y);
      }
    };
  };

  // Create copies for all elements
  const initialOpacity = [];
  elems.forEach(elem => {
    initialOpacity.push(elem.attr('opacity'));
    trackedElements.push(createPositionedCopy(elem));
    // elem.attr({opacity:0})
  });

  highlightGroup.front();
  
  // Return control object (without observer-related code)
  let tweens=[null,...options.resultStyle].map((obj,index)=>{
    return (index==0 ? null : gsap.fromTo(highlightGroup.node.children[index],{opacity:initialOpacity[index]},{duration:0.5,...obj,paused:true}))
  })
  tweens[0]=gsap.fromTo(highlightGroup.node.children[0],{opacity:0},{opacity:0.4,duration:0.5,paused:true})
  return {
    updateAll: () => trackedElements.forEach(item => item.update()),
    elements: trackedElements,
    highlightGroup,
    on :function(){
      tweens.forEach(tween=>tween&&tween.play())
    },
    off :function(callback=()=>{}){
      tweens.forEach(tween=>tween&&tween.reverse().then(callback))
    },
    remove: function() {
       this.off(()=>{
        highlightGroup.remove();
        trackedElements.forEach((item, index) => {
          item.original.attr({opacity: initialOpacity[index]});
       });
      if (typeof options.callback === 'function') {
        options.callback(elems);
      }
    })
    },
  };
}