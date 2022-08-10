
const FlipFlip = (e) =>{
        const svgS = e.target.querySelectorAll('svg')
        const svg = svgS && svgS.length && svgS.length > 1 ? svgS[1]: svgS[0]
        if (svg){
            svg.style.transform = svg.style.transform === 'rotate(180deg)' ? 'rotate(0deg)': 'rotate(180deg)';
        }
}



export default FlipFlip