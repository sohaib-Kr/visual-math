export const Ex = (props) => (
  <span className="font-semibold text-amber-700">
    {props.children}
  </span>
);

export const H = (props) => (
  <span className="font-semibold text-red-700">
    {props.children}
  </span>
);

export const SubHead = (props) => (
  <h2 className="text-[35px] mt-[65px] tracking-[1.5px] font-[poppins] mb-6 text-gray-700 leading-tight">
    {props.children}
  </h2>
);

export const Paragraph = (props) => (
  <p className="font-[merriweather] text-gray-600 text-[20px]  tracking-[1px] leading-[2.2] mb-7">
    {props.children}
  </p>
);
export const Title = (props) => (
  <p className="text-orange-700 text-[38px] tracking-[1.9px] font-[poppins] mb-[80px]">
    {props.children}
  </p>
);

export const Latex = (props) => (
  <span className="katex-input text-gray-600  text-[16px]">
    {props.children}
  </span>
);
export const Part=(props)=> <div className="h-fit rounded-lg p-8 part" data-title="First Part" id="part1">{props.children}</div>
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
