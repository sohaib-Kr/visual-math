export function colorConfig(draw){
    let visualMath = {
        backgroundColor:'#170734',
        interiorColor:'#704ddf',
        indicatorColor: '#e69443',
        borderColor: '#e6c300',
        coverColor: '#99c3e0',
        mainSegmentColor: '#45159d',
        segmentColor:'#e382c4',
        segmentBorderColor:'#f1c1e2',
        coverSegmentColor:'#76afd5',
        coverSegmentBorderColor:'#c4deed',
        textStyles: {
            explanation: {
                style: 'font:300 24px Palatino, serif',
                fill: '#2A9D8F',
                class: 'explanation-text'
            },
            equation: {
                style: 'font:500 24px Palatino, serif',
                fill: '#264653',
                class: 'equation-text'
            }
        }
    };
    return visualMath
}