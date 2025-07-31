export class Point {
    constructor({coords,symbol,parent,scale=70}) {
        this.coords = coords;
        this.scale=scale
        if(this.constructor==Point){
            this.elem = parent.use(symbol).transform({
                translate: [coords.x * scale, -coords.y * scale],
                origin: [0, 0]
            })
        }
    }
    animateTo(newCoords,animate=true,duration=500) {
        if(animate){
            this.elem.animate(duration)
            .transform({
                translate: [newCoords.x * this.scale,- newCoords.y * this.scale],
                origin: [0, 0]
            });
        }
        else{
            this.elem.transform({
                translate: [newCoords.x * this.scale, -newCoords.y * this.scale],
                origin: [0, 0]
            });
        }
        return this
    }
    updateCoords(newCoords,animate=true,duration=500) {
        this.coords = newCoords;
        this.animateTo(newCoords,animate,duration);
        return this
    }
    reset(animate=true,duration=500){
        this.animateTo(this.coords,animate,duration);
        return this
    }
    allowDrag(draw,callBack){
        this.isDragging = false;
        this.elem.on('mousedown', () => this.isDragging = true);
        draw.on('mousemove', (e) => {
            const mousePos = draw.point(e.clientX, e.clientY);
                if (this.isDragging) {
                    const x = (mousePos.x - 600) / this.scale;
                    const y = (400-mousePos.y) / this.scale;
                    this.updateCoords({x, y},false );
                    callBack()
                }
        });
        
        draw.on('mouseup', () => {
            this.isDragging = false;
            });
        return this
    }
    disableDrag(){
        this.isDragging = false;
        this.elem.off('mousedown');
        return this
    }
}

export class Vector extends Point {
    constructor({coords,symbol,parent,scale=70,lineConfig={width: 2, color: '#4285F4'}}) {
        super({coords,symbol,parent,scale})
        const angle = Math.atan2(-coords.y, coords.x) * 180 / Math.PI;
        this.elem = parent.use(symbol).transform({
            translate: [coords.x * scale, -coords.y * scale],
            rotate: angle,
            origin: [0, 0]
        })
        this.line = parent.line(0, 0, coords.x * scale, -coords.y * scale)
            .stroke(lineConfig)
            .back();
    }
    animateTo(newCoords,animate=true,duration=500) {
        const angle = Math.atan2(-newCoords.y, newCoords.x) * 180 / Math.PI;
        if(animate){
            this.elem.animate(duration)
            .transform({
                translate: [newCoords.x * this.scale,- newCoords.y * this.scale],
                rotate: angle,
                origin: [0, 0]
            });
        
            if (this.line) {
                this.line.animate(duration)
                .plot(0, 0, newCoords.x * this.scale, -newCoords.y * this.scale);
            }
        }
        else{
            this.elem.transform({
                translate: [newCoords.x * this.scale, -newCoords.y * this.scale],
                rotate: angle,
                origin: [0, 0]
            });
        
            if (this.line) {
                this.line.plot(0, 0, newCoords.x * this.scale, -newCoords.y * this.scale);
            }
        }
        return this
    }
}

// let dragModeController=null;
// let toggleButton=null;
// function dragModeOn({frame,exclusionFunc=(x,y)=>false,clickOnFrame,scale=70,end=()=>false,whenEnd=()=>{}}){

//     let off=() => {
//         frame.off('mousemove', moveCircle);
//         frame.off('click', handleClick);
//         dragCircle.animate(300).attr({ opacity: 0 }).after(() => {
//             dragCircle.remove();
//             dragCircle = null;
//         });
//     }
//     let dragCircle = frame.circle(20)
//     .attr({ 
//         fill: '#4285F4',
//         opacity: 0,
//         'fill-opacity': 0.7
//     })
//     .center(0, 0);
    
//     dragCircle.animate(300).attr({ opacity: 1 });

//     function moveCircle(e) {
//             const mousePos = frame.point(e.clientX, e.clientY);
//             const x = mousePos.x;
//             const y = mousePos.y;
//             dragCircle.center(x, y);
            
//             dragCircle.attr({ fill: exclusionFunc(x,y) ? '#FF3D00' : '#4285F4' });
//         }
        
//         function handleClick(e) {
//             const mousePos = frame.point(e.clientX, e.clientY);
            
            
//             const x = (mousePos.x - 600) / scale;
//             const y = (mousePos.y - 400) / scale;

//             if (exclusionFunc(x,y)) return;
            
//             clickOnFrame(x,y)
            
//             if (end()) {
//                 // Create resultant vector
//                 whenEnd()
                
//                 // Remove toggle button
//                 if (toggleButton) {
//                     toggleButton.kill();
//                     toggleButton = null;
//                 }
                
//                 // Exit drag mode
//                 if (dragModeController) {
//                     dragModeController.off();
//                     dragModeController = null;
//                 }
//             }
//         }
        
//         frame.on('mousemove', moveCircle);
//         frame.on('click', handleClick);
        
//         return {
//             off
//         };
// }

// export function createDragButton(param){
//     toggleButton= param.anim.sideBar.createButton({
//         name: 'Toggle Drag Mode',
//         listener: () => {
//             if (dragModeController) {
//                 dragModeController.off();
//                 dragModeController = null;
//             } else {
//                 dragModeController = dragModeOn(param);
//             }
//         }
//     });
//     return toggleButton
// }