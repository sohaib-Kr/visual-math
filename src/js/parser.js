
/**
 * Generates HTML for section cards
 * @param {Array} data - Array of section data
 * @returns {string} HTML string for section cards
 */
export function sectionParser(data) {
    let str = ``
    data.forEach((element, index) => {
        str = str + `<article class="card w-[calc(25%-16px)] m-6 h-[400px] min-w-[200px] aspect-[4/5] grid relative " id="card${index}">
                <div class="card-background w-full h-full overlap bg-radial from-[#ff8a94] to-[#b15a84] rounded-lg shadow-md origin-top-left"></div>
                <div class="card-content w-full h-full overlap grid grid-rows-[80%_20%] p-2">
                    <div class="card-image w-[97%] justify-self-center bg-pink-200 rounded-[15px] h-full">
                    <img alt="${element.title}" class="w-full h-full object-cover rounded-[15px]">
                    </div>
                    <div class="flex flex-row items-center justify-between gap-2">
                        <h2 class="card-title text-white text-2xl font-bold px-2 tracking-wide drop-shadow-sm hover:scale-105 transition-transform">${element.title}</h2>
                        <button class="card-button relative right-6 bg-white px-6 h-12 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 hover:border-gray-400 hover:shadow-sm transition-all duration-200 cursor-pointer">
                            <span>View</span>
                        </button>
                    </div>
                </div>
            </article>`
    });
    return str;
}

/**
 * Generates HTML for subsection cards
 * @param {Array} data - Array of subsection data
 * @returns {string} HTML string for subsection cards
 */
export function subsectionParser(data) {
    let str = ``
    data.forEach((element, index) => {
        str = str + `<article class="sub-section-card w-[calc(25%-16px)] m-6 h-[450px] min-w-[200px] aspect-[4/5] grid relative" id="subsection-card${index}">
                <div class="card-background w-full h-full overlap bg-white rounded-lg shadow-md origin-top-left"></div>
                <div class="card-content w-full h-full overlap grid grid-rows-[65%_10%_25%] p-2">
                    <div class="card-image w-[97%] justify-self-center bg-slate-50 rounded-[15px] h-full">
                        <img alt="${element.title}" class="w-full h-full object-cover rounded-[15px]">
                    </div>
                    <h2 class="card-title text-slate-800 text-xl font-bold px-2 tracking-wide">${element.title}</h2>
                    <div class="flex flex-col justify-between">
                        <p class="card-description text-slate-600 text-sm px-2 line-clamp-2">${element.description}</p>
                        <button class="card-button justify-self-center bg-[#b15a84] px-6 h-10 rounded-lg text-white font-medium hover:bg-[#9a4d72] transition-colors duration-200 cursor-pointer self-end">
                            <span>View</span>
                        </button>
                    </div>
                </div>
            </article>`
    });
    return str;
}