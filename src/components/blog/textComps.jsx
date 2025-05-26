export const Ex=(props)=> <span className="font-bold text-yellow-400">{props.children}</span>
export const H=(props)=> <span className="font-bold text-red-500">{props.children}</span>
export const SubHead=(props)=> <h2 className="text-3xl font-bold mb-6 text-slate-800 leading-tight">{props.children}</h2>
export const Paragraph=(props)=> <p className="text-slate-600 text-lg leading-relaxed mb-6">{props.children}</p>
export const Part=(props)=> <div className="h-fit rounded-lg p-8 part" data-title="First Part" id="part1">{props.children}</div>
export const Title=(props)=> <span className="font-bold text-orange-500">{props.children}</span>
export const Latex=(props)=> <span className="katex-input">{props.children}</span>
export const AnimationFrame=(props)=> (
<div className="w-full grid grid-cols-[40%_60%] p-[20px] rounded-[10px] grid-rows-[100%] border border-black" style={props.style}>
  <div className="w-[95%] h-full control">
    <div className="flex flex-col gap-2 h-[50%]">
    </div>
    <div className="flex flex-col gap-2 h-[50%] flex-col-reverse">
    </div>
  </div>
  <div id={props.id}></div>
</div>)
