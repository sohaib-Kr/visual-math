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

