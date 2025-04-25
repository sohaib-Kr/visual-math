import { VectorTransforms } from "../Transformations"

export function deformation({mathFunc=VectorTransforms.identity, smoothness}) {
    if (process.env.NODE_ENV === 'development') {
        if (!Object.values(VectorTransforms).includes(mathFunc)) throw new Error('mathFunc must be a valid VectorTransforms function')
    }
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