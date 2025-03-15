export function colorConfig(draw){
    let gradient = draw.gradient('radial', function(add) {
        add.stop(0, '#DAACF6')
        add.stop(1, '#874CC3')
    })
    let visualMath = {
        interiorColor: gradient.from(0.1, 0.2).to(0.5, 0.5).radius(1),
        indicatorColor: '#ff7700',
        borderColor: '#e6c300',
        coverColor: '#99c3e0',
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