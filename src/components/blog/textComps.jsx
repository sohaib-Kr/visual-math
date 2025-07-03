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
  <h2 className="text-[35px] mt-[65px] tracking-[1.5px] font-[poppins] mb-6 text-gray-700 leading-tight fadeOnScroll">
    {props.children}
  </h2>
);

export const Paragraph = (props) => (
  <p className="font-[merriweather] text-gray-600 text-[20px]  tracking-[1px] leading-[2.2] mb-7 fadeOnScroll">
    {props.children}
  </p>
);
export const Li = (props) => (
  <li className="font-[merriweather] text-gray-600 text-[20px]  tracking-[1px] leading-[2.2] mb-7 fadeOnScroll">
    {props.children}
  </li>
);
export const Title = (props) => (
  <p className="text-orange-700 text-[38px] tracking-[1.9px] font-[poppins] mb-[80px] fadeOnScroll">
    {props.children}
  </p>
);


export const Part=(props)=> <div className="h-fit rounded-lg p-8 part" data-title={props.title}>{props.children}</div>
export const AnimationFrame=(props)=> (
<div className="w-full my-[90px] grid grid-cols-[40%_60%] grid-rows-[100%] " style={props.style}>
  <div className="w-[95%] h-full control">
    <div className="flex flex-col gap-2 h-[50%]">
    </div>
    <div className="flex flex-col gap-2 h-[50%] flex-col-reverse">
    </div>
  </div>
  <div id={props.id}></div>
</div>)
