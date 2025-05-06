import { VectorTransforms } from "../Transformations"
//this function deforms a vector space by transforming every point in the space according to a math function
//it takes a math function and a smoothness parameter
//if smoothness is true then the deformation is animated
//if smoothness is false then the deformation is instant


//
//
//              you are obliged to retrieve the math functions from VectorTransforms object
//                              and not a foreign function
//
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