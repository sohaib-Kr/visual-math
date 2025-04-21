export function label(mode){
    
    if(mode=='array'){
        this.field.forEach((column,i)=>{
            column.forEach((vector,j)=>{
                vector.holder.text("x:"+i+"y:"+j).fill('white')
                .move((i-(parseInt(this.field.length/2))) * this.plane.unit.u, (parseInt(this.field.length/2)-j) * this.plane.unit.v)
                })
            })
        }
        else if(mode=='cartesian'){
            this.noField.forEach((vector)=>{
                vector.holder.text("x:"+vector.x+"y:"+vector.y).fill('white')
                .dmove(vector.x* this.plane.unit.u, (-vector.y) * this.plane.unit.v)
            })
        }
    }