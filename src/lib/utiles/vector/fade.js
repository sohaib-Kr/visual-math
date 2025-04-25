export function fadeIn (duration = 500) {       
        this.noField.forEach((vect)=>{
           vect.holder.animate(duration).attr({opacity:1})
         })
    }

export function fadeOut( duration = 500 ) {       
        this.noField.forEach((vect)=>{
           vect.holder.animate(duration).attr({opacity:0})
         })
    }