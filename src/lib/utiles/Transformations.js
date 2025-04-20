function transform(dx,dy,scale,rotate){
    return{
        dx:dx,
        dy:dy,
        scale:scale,
        rotate:rotate
    }
}
export const VectorTransforms={
    identity:function(){
        return transform(0,0,1,0)
    },
    vectorScaleX:function(data){
        return transform(0,0,(17+data.x)/34,2*data.y+2*data.x)
    },
    vectorRotate:function(data){
        if(data.x==0 && data.y==0){
            return transform(0,0,0,0)
        }
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
    },
    pointRotate:function(data){
        return transform(0,0,1,data.rotate)
    },
    pointExpansion:function(data){
        let expansionRatio=0.5
        let dx=data.x*expansionRatio
        let dy=-data.y*expansionRatio
        return transform(60*dx,60*dy,1,0)
    },
    vectorExpansion:function(data){
        if(data.x==0 && data.y==0){
            return transform(0,0,0,0)
        }
        if(data.x<0){
         
        let expansionRatio=0.05
        let theta=180-Math.atan(data.y/data.x)*180/Math.PI
        return transform(0,0,0.4+expansionRatio*Math.sqrt(data.x*data.x+data.y*data.y),theta)   
        }
        let expansionRatio=0.05
        let theta=-Math.atan(data.y/data.x)*180/Math.PI
        return transform(0,0,0.4+expansionRatio*Math.sqrt(data.x*data.x+data.y*data.y),theta)
    },
    vectorSkewX:function(data){
        let skewRatio=0.2
        return transform(0,0,data.y*skewRatio,0)
    },
    pointSkewX:function(data){
        return transform(data.y*60,0,1,0)
    },
    
    pointSkewY:function(data){
        return transform(0,data.x*60,1,0)
    }
}