export function getCurrentPos(point){
    point=point.elem
    let x=point.bbox().x+point.transform().translateX
    let y=point.bbox().y+point.transform().translateY
    return {x,y}
}

//this function creates a shape and append it to a vector space 
//so that whenever you deform the vector space the shape deforms accordingly
//it returns an object containing the shape and an interval that updates the shape

//to do:
//refactor and reorganize append shape class for better usability
//add more options for the shape

export function appendShape({ points, closed }){

    if (process.env.NODE_ENV === 'development') {
        if (points.length%2==0) throw new Error('number of points must be odd')
        if(points.length<3) throw new Error('number of points must be greater than 3')
      }

        
        function getPath({ points }){
            let {x,y}=getCurrentPos(points[0])
            let path=`M ${x} ${y}`
            for (let  i= 0;  i< points.length-2; i+=2) {
                let c=getCurrentPos(points[i+1])
                let e=getCurrentPos(points[i+2])
                path+=`S ${c.x} ${c.y} ${e.x} ${e.y}`
            }
            if(closed){
                path+=`S ${getCurrentPos(points[0]).x} ${getCurrentPos(points[0]).y} ${getCurrentPos(points[0]).x} ${getCurrentPos(points[0]).y}`
            }
            return path
        }
        let shape
        if(closed){
            shape=this.group.path(getPath({ points: points.map((coords)=>this.field[coords.x][coords.y]) }))
            .fill('white')
        }
        else{
            shape=this.group.path(getPath({ points: points.map((coords)=>this.field[coords.x][coords.y]) }))
            .fill('none')
            .stroke({color:'white',width:3})
        }


        //get all the vectors in the field that corresponds to the points coordinations
        const fieldProjection=points.map((coords)=>this.field[coords.x][coords.y])


        return({
            interval:setInterval(()=>{
                shape.animate(20)
                .plot(getPath({ points: fieldProjection }))
            },50),
            elem:shape
        })
    }