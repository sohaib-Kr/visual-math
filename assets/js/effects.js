function emphasize(element){
    let shadow=draw.rect(window.getComputedStyle(draw.node).width, window.getComputedStyle(draw.node).height).attr({
        fill: "grey",
        opacity: 0,
    });
    shadow.animate(200).attr({
        opacity: 0.3,
    })
    shadow.after(element);
    let f=0;
    let I=setInterval(()=>{
        f+=1;
        element.attr({
            style:`filter: brightness(${f/53+1}) drop-shadow(0 0 ${f/2}px white);`,
        });
        f>10 ? clearInterval(I) : null;
    }, 10);
    return () => {
        shadow.animate(200).attr({
            opacity: 0,
        }).after(() => shadow.remove());
        element.attr({
            style:'',
        });
    }
}

