function transform(dx,dy,scale,rotate){
    return{
        dx:dx,
        dy:dy,
        scale:scale,
        rotate:rotate
    }
}
export const Transforms={
    identity:function(){
        return transform(0,0,1,0)
    },
    vectorScaleX:function(data){
        return transform(0,0,(17+data.x)/34,2*data.y+2*data.x)
    },
    vectorRotate:function(data){
        if(data.x>=0){
            const tan=data.y/data.x
            let alpha=180*Math.atan(tan)/Math.PI
            let theta=90-alpha
            return transform(0,0,0.5,theta)
        }
        const tan=data.y/data.x
        let alpha=180*Math.atan(tan)/Math.PI
        let theta=90-alpha
        return transform(0,0,0.5,180+theta)
    }
}


