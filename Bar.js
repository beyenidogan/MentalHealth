class Bar {

    constructor(state, setGlobalState) {
        // initialize properties here
        this.width = window.innerWidth * 0.25;
        this.height = window.innerHeight * 0.5;
        this.margins = { top: 10, bottom: 30, left: 10, right: 50 };
        this.duration = 1000;
        this.format = d3.format(",." + d3.precisionFixed(1) + "f");
    
        this.svg = d3
            .select("#bar-chart")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);


        // Add options to dropdowns
        this.selectResource = d3
        .select("#dropdown-resource")
        .selectAll("option")
        .data(state.listResource)
        .join("option")
        .attr("value", d => d)
        .text(d => d);

        this.selectCondition = d3
        .select("#dropdown-condition")
        .selectAll("option")
        .data(state.listCondition)
        .join("option")
        .attr("value", d => d)
        .text(d => d); 

        // Set dropdown click event
        this.selectResource = d3
        .select("#dropdown-resource")
        .on("change",
            function () {
                console.log("The new selected resource is", this.value)
                setGlobalState({
                    selectedResource: this.value,
                })
            })


        this.selectCondition = d3
        .select("#dropdown-condition")
        .on("change",
            function () {
                console.log("The new selected condition is", this.value)
                    setGlobalState({
                        selectedCondition: this.value,
                    })
                })

    }
    

    /////////DRAW

    draw(state, setGlobalState) {
        console.log("now I am drawing the bar graph");

        d3.select("#bar-title")
            .select("#selectedCondition")
            .text(state.selectedCondition)
            .style("fill", "white")

        let showbyBarData = state.worldData
        console.log(showbyBarData)


        let filteredBarData=showbyBarData.filter(function(d){
            if (state.selectedCondition==="Alcohol use disorders"||state.selectedCondition==="Substance use disorders"){
                return d.selection===1
            } else if (state.selectedCondition==="Eating disorders") {
                return d.selection===3
            } else {
                return d.selection===2
            }
        })
            
        console.log(filteredBarData)



        let yScale = d3
            .scaleBand()
            .domain(filteredBarData.map(d => d.cause_name))
            .range([this.height - this.margins.top, this.margins.bottom])
            .paddingInner(0.6)


        let xScale = d3
            .scaleLinear()
            .domain([0, d3.max(filteredBarData, d => +d.val)])
            .range([this.margins.left, this.width - this.margins.right])  
        
        const bars = this.svg
            .selectAll("g.bar")
            .data(filteredBarData, d=>d.cause_name)
            .join(
            enter =>
                enter
                .append("g")
                .attr("class", "bar")
                .attr("fill-opacity", 0.8)
                .call(enter => enter.append("rect"))
                .call(enter => enter.append("text")),
            update => update
                .call(update=>update) 
            ,
            exit => exit.remove()
            )
        
        bars
            .select("rect")
            .attr("y",d=>yScale(d.cause_name)) 
            .transition()
            .duration(this.duration)
            .attr("y",d=>yScale(d.cause_name)) 
            .attr("width", d=>xScale(d.val))
            .attr("height", yScale.bandwidth()*0.8)
            .style("fill", "white") 
        
        bars
            .select("text")
            .attr("dy", "-0.5em")
            .attr("y",d=>yScale(d.cause_name)) 
            .style("fill","white")
            .style("font-size","12px")
            .text(d => `${d.cause_name}: ${this.format(d.val)}`); 
    }
  
}     

export { Bar };
  