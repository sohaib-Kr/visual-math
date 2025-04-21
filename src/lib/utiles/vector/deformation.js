export function deformation(mathFunc, smoothness) {
        if (smoothness){
            this.noField.forEach((vector) => {
                const output = mathFunc(vector)
                vector.elem.animate(700).transform({
                    scale:[output.scale,1],
                    rotate:output.rotate,
                    translate:[output.dx,output.dy],
                    origin:'top left'
                })
            })
        }
        else{this.noField.forEach((vector) => {
            const output = mathFunc(vector)
            vector.elem.transform({
                scale:[output.scale,1],
                rotate:output.rotate,
                translate:[output.dx,output.dy],
                origin:'top left'
            })
        })}
    }