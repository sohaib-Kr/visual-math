import { vMathAnimation } from "@/lib/library";
const anim = new vMathAnimation('simplicialComplex');

anim.setInit(function(){
    const draw=anim.frame
    const vertexSymbol=draw.symbol().circle(10).attr(anim.config().indicationPoint)
    const main=draw.group()
    //edges position
    let vertices,edges,triangles,tetrahedron
    let verticesElems=[],trianglesElems=[],edgesElems=[],tetrahedronElem
    let curvedTriangle
    
    let textSpace
    let textSpace2


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
            
            let curvedTriangleInterior=main.path('M 0 0 Q 56 320 200 200 T 250 -200 C 192 -33 -2 -109 0 0')
            .attr({opacity:0,fill:'#44335e'})
            curvedTriangle=main.path('M 0 0 Q 56 320 200 200 T 250 -200 C 192 -33 -2 -109 0 0')
            .attr({...anim.config().path1})
            anim.elements.latexText({inputString:'/S_1/',textStyle:{fontSize:'30px',color:'#ff99a7'}}).addTo(main)
            .move(-280,-220)
            anim.elements.latexText({inputString:'/S_2/',textStyle:{fontSize:'30px',color:'#ff99a7'}}).addTo(main)
            .move(300,-220)

            curvedTriangle.animate({duration:800,delay:400}).attr({opacity:1})
            curvedTriangleInterior.animate({duration:800,delay:800}).attr({opacity:1})
            triangles=['a,b,c']
            tetrahedron=null
            textSpace.update({newText:'The two complexes S1 and S2 are algebraically and topologically equal even if their geometric representation may seem different',fade:true})
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
            textSpace.update({newText:'The complex S represent a single shape even if it is disconnected in terms of vertices connections',fade:true})
            anim.elements.latexText({inputString:'/S/',textStyle:{fontSize:'30px',color:'#ff99a7'}}).addTo(main)
            .move(-280,-220)
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
                textSpace.update({newText:'Simplicial complexes can fill a 3d spaces, those edges don\'t cross each other',fade:true})
            }
        else if (mode == 4) {
            // Intersecting edges (invalid simplicial complex)
            vertices = {
                a: [-350, -150],  
                b: [350, 250],    
                c: [-350, 250],
            }
            edges = ['a,b']
            triangles = null
            tetrahedron = null
            
            // Draw the intersecting edges
            let wrongPath=main.path('M -350 250 L 0 50').attr({...anim.config().path1})

            wrongPath.animate({duration:800,delay:400}).attr({opacity:1})
            setInterval(()=>wrongPath.animate({duration:400}).attr({stroke:'#807261'})
            .animate({duration:400}).attr({stroke:'#00c9a7'})
            .animate({duration:400}).attr({stroke:'#807261'})
            .animate({duration:400}).attr({stroke:'#00c9a7'}),3000)
            
    
            
            textSpace.update({
                newText: 'Simplicies can only intersect in another simplex',
                fade: true
            })
        }
        else if (mode == 5) {
            // Triangle with missing edge (invalid)
            vertices = {
                a: [-300, 0],
                b: [0, 250],
                c: [300, 0],
                d: [0, -200]
            }
            edges = ['a,b', 'b,c'] // Missing a,c edge
            triangles = ['a,b,c']  // But triangle is defined
            tetrahedron=null
            
            // Draw the missing path
            const backgroundColor=anim.colorConfig().backgroundColor

            setTimeout(()=>{
                let wrongPath=main.path('M -287 0 L 298 0').attr({...anim.config().path1,stroke:backgroundColor})
            wrongPath.animate({duration:800,delay:400}).attr({opacity:1})
            
            setInterval(()=>wrongPath.animate({duration:400}).attr({stroke:'#ff1a1a'})
            .animate({duration:400}).attr({stroke:backgroundColor})
            .animate({duration:400}).attr({stroke:'#ff1a1a'})
            .animate({duration:400}).attr({stroke:backgroundColor})
            ,2000)
            },1000)
            textSpace.update({
                newText: 'To add a simplex, all its boundary simplicies must be elements of the complex',
                fade: true
            })
        }
        else if (mode == 6) {
            // Pyramid shape but not a proper tetrahedron
            vertices = {
                a: [-500, -100],
                b: [-100, -100],
                c: [-300, 200],
                d: [-300, 0],
                e: [-140, 80],
                f: [150, -150],
                g: [80, 120],
                h: [350, 180],
                i: [400, -80]
            }
            edges = [
                'a,b', 'e,c', 'b,e', 'c,a', 'a,d', 'b,d', 'c,d',  // Original edges
                'f,g', 'g,h', 'h,i', 'i,f' 
            ]
            triangles = null
            tetrahedron = null
            
            const pathABD = main.path(`M ${vertices['a'][0]} ${vertices['a'][1]} 
                L ${vertices['b'][0]} ${vertices['b'][1]} 
                L ${vertices['d'][0]} ${vertices['d'][1]} Z`)
.attr({fill: '#faeaff',opacity:0})

// 2. Path acd (triangle from left apex)
const pathACD = main.path(`M ${vertices['a'][0]} ${vertices['a'][1]} 
                L ${vertices['c'][0]} ${vertices['c'][1]} 
                L ${vertices['d'][0]} ${vertices['d'][1]} Z`)
.attr({fill: '#faeaff',opacity:0})

// 3. Path bced (quadrilateral center)
const pathBCED = main.path(`M ${vertices['b'][0]} ${vertices['b'][1]} 
                 L ${vertices['e'][0]} ${vertices['e'][1]} 
                 L ${vertices['c'][0]} ${vertices['c'][1]} 
                 L ${vertices['d'][0]} ${vertices['d'][1]} Z`)
.attr({fill: '#faeaff',opacity:0})

// 4. Path figh (square on right side)
const pathFIGH = main.path(`M ${vertices['f'][0]} ${vertices['f'][1]} 
                 L ${vertices['i'][0]} ${vertices['i'][1]} 
                 L ${vertices['h'][0]} ${vertices['h'][1]} 
                 L ${vertices['g'][0]} ${vertices['g'][1]} Z`)
.attr({fill: '#44335e',opacity:0})

// Animation sequence
pathABD.animate({duration: 800, delay: 400}).attr({opacity: 0.4})
pathACD.animate({duration: 800, delay: 400}).attr({opacity: 0.4})
pathBCED.animate({duration: 800, delay: 400}).attr({opacity: 0.4})
pathFIGH.animate({duration: 800, delay: 400}).attr({opacity: 1})
            

            
            function redSignal(path,color){
                setInterval(()=>path.animate({duration:400}).attr({fill:'#ff1a1a'})
            .animate({duration:400}).attr({fill:color})
            .animate({duration:400}).attr({fill:'#ff1a1a'})
            .animate({duration:400}).attr({fill:color})
            ,3000)
            }
            

            redSignal(pathABD,'#faeaff')
            redSignal(pathACD,'#faeaff')
            redSignal(pathBCED,'#faeaff')
            redSignal(pathFIGH,'#44335e')

            textSpace.update({
                newText: 'Pyramids and quadrilaterals are not simplicial complexes, but their boundary (sum of edges/triangles) is',
                fade: true
            })
        }
    }

    function clearComplex({callback}){
        main.children().forEach(elem=>{
            elem.animate(800).attr({opacity:0}).after(()=>elem.remove())
        })
        setTimeout(callback,1000)
        verticesElems=[]
        trianglesElems=[]
        edgesElems=[]
        tetrahedronElem=null
    }

    function renderComplex(){
        if(triangles)triangles.forEach((elem)=>{
            const [a,b,c]=elem.split(',')
            const tri=main.path(`M ${vertices[a][0]} ${vertices[a][1]} L ${vertices[b][0]} ${vertices[b][1]} L ${vertices[c][0]} ${vertices[c][1]} Z`)
            .attr({fill:'#44335e',opacity:0})
            trianglesElems.push(tri)
        })
        if(tetrahedron){
            const [a,b,c]=tetrahedron.split(',')
            tetrahedronElem=main.path(`M ${vertices[a][0]} ${vertices[a][1]} L ${vertices[b][0]} ${vertices[b][1]} L ${vertices[c][0]} ${vertices[c][1]} Z`)
            .attr({fill:'#faeaff',opacity:0})
        }
        
    
        edges.forEach((elem)=>{
            const [a,b]=elem.split(',')
            const edge=main.path(`M ${vertices[a][0]} ${vertices[a][1]} L ${vertices[b][0]} ${vertices[b][1]}`)
            .attr({...anim.config().path1})
            edgesElems.push(edge)
        })
    
        for(let key in vertices){
            const vertex=main.use(vertexSymbol).center(vertices[key][0],vertices[key][1]).attr({opacity:0})
            const txt=main.text(key).move(vertices[key][0]+20,vertices[key][1]+20)
            //.attr({opacity:0})
            Object.assign(txt.node.style,{fontSize:'35px',fill:'#ffa64d'})
            verticesElems.push({vertex,txt})
        }
        verticesElems.forEach(elem=>elem.vertex.animate({duration:800}).attr({opacity:1}))
        edgesElems.forEach(elem=>elem.animate({duration:800,delay:400}).attr({opacity:1}))
        trianglesElems.forEach(elem=>elem.animate({duration:800,delay:800}).attr({opacity:1}))
        if(tetrahedronElem)tetrahedronElem.animate({duration:800,delay:1200}).attr({opacity:0.4})
    }
    changeComplex(0)
    renderComplex()
    

    




    let rightBracket


    edgesElems.forEach(elem=>elem.attr({opacity:0}))
    verticesElems.forEach(elem=>elem.vertex.attr({opacity:0}))
    trianglesElems.forEach(elem=>elem.attr({opacity:0}))
    if(tetrahedronElem)tetrahedronElem.attr({opacity:0})
   

    main.transform({translate:[600,400]})
    anim.initSteps([
        ()=>{
        },
        ()=>{
            verticesElems.forEach((elem)=>{
                elem.vertex.animate(1000).attr({opacity:1})
                setTimeout(()=>elem.txt.animate(1000).attr({opacity:1}),500)
            })

            
            const set=Object.keys(vertices).map(key=>`\\{${key}\\}`).join('\\allowbreak,')
            textSpace2=anim.sideBar.createText()
            .update({newText:` \\mathbb{K}=\\{\\emptyset,${set}`,latex:true,fade:true,callback:()=>{
                rightBracket=textSpace2.appendText({text:'\\}',latex:true})
            }})

            textSpace=anim.sideBar.createText()
            .update({newText:'Any arbitrary set of points form a 0-dimensional simplicial complex',fade:true})
        },
        ()=>{},
        ()=>{},
        ()=>{
            textSpace.update({newText:'',fade:true})
            verticesElems.forEach(elem=>elem.txt.animate(800).attr({opacity:0}))
        },
        ()=>{
            edgesElems.forEach(elem=>elem.animate(800).attr({opacity:1}))
            rightBracket.innerHTML=''
            const set=edges.map(edge=>`\\{${edge}\\}`).join('\\allowbreak,')
            textSpace2.appendText({text:','+set,latex:true,fade:true,callback:()=>{
                rightBracket=textSpace2.appendText({text:'\\}',latex:true,fade:true})
                
            textSpace.update({newText:'Adding some arbitrary set of edges form a 1-dimensional simplicial complex',fade:true})
            }})
        },
        ()=>{},
        ()=>{},
        ()=>{
            textSpace.update({newText:'',fade:true})
        },
        ()=>{
            trianglesElems.forEach(elem=>elem.animate(800).attr({opacity:1}))
            rightBracket.innerHTML=''
            const set=triangles.map(triangle=>`\\{${triangle}\\}`).join('\\allowbreak,')
            textSpace2.appendText({text:','+set,latex:true,fade:true,callback:()=>{
                rightBracket=textSpace2.appendText({text:'\\}',latex:true,fade:true})
                
            textSpace.update({newText:'Adding some arbitrary set of triangles form a 2-dimensional simplicial complex',fade:true})
            }})
        },
        ()=>{},
        ()=>{},
        ()=>{
            textSpace.update({newText:'',fade:true})
        },
        ()=>{
            tetrahedronElem.animate(800).attr({opacity:0.3})
            rightBracket.innerHTML=''
            textSpace2.appendText({text:',\\{a,b,d,h\\}',latex:true,fade:true,callback:()=>{
                rightBracket=textSpace2.appendText({text:'\\}',latex:true,fade:true})
                
            textSpace.update({newText:'Adding some arbitrary set of tetrahedrons form a 3-dimensional simplicial complex',fade:true})
            }})
        },
        ()=>{},
        ()=>{
            textSpace.update({newText:'',fade:true})
            textSpace2.update({newText:'',fade:true})
            clearComplex()
        },
        ()=>{
            anim.pause()
            textSpace2=anim.sideBar.createText()
            textSpace=anim.sideBar.createText()

            textSpace2.appendText({text:'Simplicial complexes can be in different forms',latex:false,fade:true,callback:()=>{
                // textSpace.update({newText:'Adding some arbitrary set of tetrahedrons form a 3-dimensional simplicial complex',fade:true})
            }})
            let buttons=anim.sideBar.createButtonGroup({
                buttons:[
                    {name:'curved',value:'0'},
                    {name:'non connected',value:'1'},
                    {name:'multi dimensional',value:'2'},
                ],
                listener:(value)=>{
                    clearComplex({callback:()=>{
                        changeComplex(1+parseInt(value))
                        renderComplex()
                    }})
                },
                selectedValue:'0'
            })
            const next=anim.sideBar.createButton({
                name:'next',
                listener:()=>{
                    buttons.kill()
                    next.kill()
                    anim.play()
                }
            })
        },
        ()=>{
            anim.pause()
            
            textSpace=anim.sideBar.createText()
            textSpace2=anim.sideBar.createText()

    textSpace2.update({
        newText: 'These are NOT valid simplicial complexes:',
        latex: false,
        fade: true
    })
    
    let buttons=anim.sideBar.createButtonGroup({
        buttons: [
            {name: 'Intersecting edges', value: '0'},
            {name: 'Incomplete triangle', value: '1'},
            {name: 'Invalid tetrahedron', value: '2'},
        ],
        listener: (value) => {
            clearComplex({callback: () => {
                changeComplex(4 + parseInt(value)) // Modes 4-6
                renderComplex()
            }})
        },
        selectedValue: '0'
    })
            const playAgain=anim.sideBar.createButton({
                name:'play again',
                listener:()=>{
                    buttons.kill()
                    playAgain.kill()
                    anim.playAgain()
                }
            })
        }

    ])
})

export default anim