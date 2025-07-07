import { vMathAnimation } from "@/lib/library";
import gsap from 'gsap';
const anim = new vMathAnimation('simplicialComplex');

anim.setInit(function(){
    const draw=anim.frame
    const vertexSymbol=draw.symbol().circle(10).attr(anim.config().indicationPoint)
    const main=draw.group()
    //edges position
    let vertices,edges,triangles,tetrahedron
    let verticesElems=[],trianglesElems=[],edgesElems=[],tetrahedronElem
    let curvedTriangle
    function changeComplex(mode){
        if(mode==0){
            vertices={
                a:[-200,200],
                b:[-100,-200],
                c:[200,100],
                d:[100,100],
                e:[250,-250],
                f:[150,0],
                g:[50,-300],
                h:[-50,0]
            }
            edges=['a,b','b,d','a,d','f,d','c,d','f,g','g,b','b,f','a,h','h,d','h,b']
            triangles=['a,b,h','a,h,d','b,d,h','b,f,g']
            tetrahedron='a,b,d'
        }
        else if(mode==1){
            vertices={
                a:[-400,0],
                b:[-200,200],
                c:[-150,-200],
                e:[0,0],
                f:[200,200],
                g:[250,-200],
            }
            edges=['a,b','b,c','a,c']
            curvedTriangle=main.path('M 0 0 Q 56 320 200 200 T 250 -200 C 192 -33 -2 -109 0 0')
            .attr({...anim.config().path1,opacity:1,fill:'#44335e'})
            anim.elements.latexText({inputString:'/S_1/',textStyle:{fontSize:'30px',color:'#ff99a7'}}).addTo(main)
            .move(-280,-220)
            anim.elements.latexText({inputString:'/S_2/',textStyle:{fontSize:'30px',color:'#ff99a7'}}).addTo(main)
            .move(300,-220)
            triangles=['a,b,c']
            tetrahedron=null
        }
        else if(mode==2){
            vertices={
                a:[-400,200],
                b:[-200,-200],
                c:[-100,300],
                d:[0,100],
                e:[0,0],
                f:[300,100],
                g:[500,-300],
                h:[100,-200],
                i:[300,-100]
            }
            edges=['a,b','b,d','a,d','e,d','i,h','i,g','i,f','g,f','g,h','f,h']
            triangles=['a,b,d']
            tetrahedron='f,g,h'
        }
        else if(mode==3){
            vertices={
                a:[200,200],
                b:[-100,200],
                c:[-200,-300],
                d:[200,-200],
            }
            edges=['a,c','b,d','a,d']
            triangles=null
            tetrahedron=null
            setTimeout(()=>{
                edgesElems[1].animate(800).attr({opacity:0.7})
                verticesElems[1].vertex.animate(800).attr({opacity:0.7})
            },1000)
        }
    }

    function clearComplex(){
        main.children().forEach(elem=>{
            elem.animate(800).attr({opacity:0}).after(()=>elem.remove())
        })
        verticesElems=[]
        trianglesElems=[]
        edgesElems=[]
        tetrahedronElem=null
    }
    function renderComplex(){
        if(triangles)triangles.forEach((elem)=>{
            const [a,b,c]=elem.split(',')
            const tri=main.path(`M ${vertices[a][0]} ${vertices[a][1]} L ${vertices[b][0]} ${vertices[b][1]} L ${vertices[c][0]} ${vertices[c][1]} Z`)
            .attr({fill:'#44335e'})
            trianglesElems.push(tri)
        })
        if(tetrahedron){
            const [a,b,c]=tetrahedron.split(',')
            tetrahedronElem=main.path(`M ${vertices[a][0]} ${vertices[a][1]} L ${vertices[b][0]} ${vertices[b][1]} L ${vertices[c][0]} ${vertices[c][1]} Z`)
            .attr({fill:'#faeaff',opacity:0.3})
        }
        
    
        edges.forEach((elem)=>{
            const [a,b]=elem.split(',')
            const edge=main.path(`M ${vertices[a][0]} ${vertices[a][1]} L ${vertices[b][0]} ${vertices[b][1]}`)
            .attr({...anim.config().path1,opacity:1})
            edgesElems.push(edge)
        })
    
        for(let key in vertices){
            const vertex=main.use(vertexSymbol).center(vertices[key][0],vertices[key][1])
            const txt=main.text(key).move(vertices[key][0]+20,vertices[key][1]+20).attr({opacity:0})
            Object.assign(txt.node.style,{fontSize:'35px',fill:'#ffa64d'})
            verticesElems.push({vertex,txt})
        }
        
    }
    changeComplex(0)
    renderComplex()
    

    


    let textSpace
    let textSpace2


    let rightBracket


    edgesElems.forEach(elem=>elem.attr({opacity:0}))
    verticesElems.forEach(elem=>elem.vertex.attr({opacity:0}))
    trianglesElems.forEach(elem=>elem.attr({opacity:0}))
    if(tetrahedronElem)tetrahedronElem.attr({opacity:0})
   

    main.transform({translate:[600,400]})
    anim.initSteps([
        // ()=>{
        // },
        // ()=>{
        //     verticesElems.forEach((elem)=>{
        //         elem.vertex.animate(1000).attr({opacity:1})
        //         setTimeout(()=>elem.txt.animate(1000).attr({opacity:1}),500)
        //     })

            
        //     const set=Object.keys(vertices).map(key=>`\\{${key}\\}`).join('\\allowbreak,')
        //     textSpace2=anim.sideBar.createText()
        //     .update({newText:` \\mathbb{K}=\\{\\emptyset,${set}`,latex:true,fade:true,callback:()=>{
        //         rightBracket=textSpace2.appendText({text:'\\}',latex:true})
        //     }})

        //     textSpace=anim.sideBar.createText()
        //     .update({newText:'Any arbitrary set of points form a 0-dimensional simplicial complex',fade:true})
        // },
        // ()=>{},
        // ()=>{},
        // ()=>{
        //     textSpace.update({newText:'',fade:true})
        //     verticesElems.forEach(elem=>elem.txt.animate(800).attr({opacity:0}))
        // },
        // ()=>{
        //     edgesElems.forEach(elem=>elem.animate(800).attr({opacity:1}))
        //     rightBracket.innerHTML=''
        //     const set=edges.map(edge=>`\\{${edge}\\}`).join('\\allowbreak,')
        //     textSpace2.appendText({text:','+set,latex:true,fade:true,callback:()=>{
        //         rightBracket=textSpace2.appendText({text:'\\}',latex:true,fade:true})
                
        //     textSpace.update({newText:'Adding some arbitrary set of edges form a 1-dimensional simplicial complex',fade:true})
        //     }})
        // },
        // ()=>{},
        // ()=>{},
        // ()=>{
        //     textSpace.update({newText:'',fade:true})
        // },
        // ()=>{
        //     trianglesElems.forEach(elem=>elem.animate(800).attr({opacity:1}))
        //     rightBracket.innerHTML=''
        //     const set=triangles.map(triangle=>`\\{${triangle}\\}`).join('\\allowbreak,')
        //     textSpace2.appendText({text:','+set,latex:true,fade:true,callback:()=>{
        //         rightBracket=textSpace2.appendText({text:'\\}',latex:true,fade:true})
                
        //     textSpace.update({newText:'Adding some arbitrary set of triangles form a 2-dimensional simplicial complex',fade:true})
        //     }})
        // },
        // ()=>{},
        // ()=>{},
        // ()=>{
        //     textSpace.update({newText:'',fade:true})
        // },
        // ()=>{
        //     tetrahedronElem.animate(800).attr({opacity:0.3})
        //     rightBracket.innerHTML=''
        //     textSpace2.appendText({text:',\\{a,b,d,h\\}',latex:true,fade:true,callback:()=>{
        //         rightBracket=textSpace2.appendText({text:'\\}',latex:true,fade:true})
                
        //     textSpace.update({newText:'Adding some arbitrary set of tetrahedrons form a 3-dimensional simplicial complex',fade:true})
        //     }})
        // },
        ()=>{},
        // ()=>{
        //     textSpace.update({newText:'',fade:true})
        //     textSpace2.update({newText:'',fade:true})
        //     clearComplex()
        // },
        ()=>{
            textSpace=anim.sideBar.createText()
            textSpace2=anim.sideBar.createText()

            textSpace2.appendText({text:'Simplicial complexes can be in different forms',latex:false,fade:true,callback:()=>{
                // textSpace.update({newText:'Adding some arbitrary set of tetrahedrons form a 3-dimensional simplicial complex',fade:true})
            }})
            anim.sideBar.createButtonGroup({
                buttons:[
                    {name:'curved',value:'0'},
                    {name:'non connected',value:'1'},
                    {name:'multi dimensional',value:'2'},
                ],
                listener:(value)=>{
                    clearComplex()
                    changeComplex(1+parseInt(value))
                    renderComplex()
                },
                selectedValue:'0'
            })
        }
    ])
})

export default anim