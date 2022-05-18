class Map {

    constructor(state, setGlobalState) {
        // initialize properties here
        this.width = window.innerWidth * 0.9;
        this.height = window.innerHeight * 0.68;        
        this.margins = { top: 20, bottom: 30, left: 100, right: 0 };
        this.countryjoin =[]
        this.duration = 1000;
    
        this.svg = d3
          .select("#map-chart")
          .append("svg")
          .attr("width", this.width)
          .attr("height", this.height);
    }

     draw(state, setGlobalState) {
        console.log("now I am drawing my map");
        
        console.log("loaded state.countriesData for map",  state.countriesData);
        console.log("loaded state.geojson for map",  state.geojson);


        //this is all the dropdown filters regardless of the chart type
       
        let metricData=state.countriesData

        let filteredConditionData=metricData.filter(d => d.Metric===state.selectedCondition);
        let filteredResourceData=metricData.filter(d => d.Metric===state.selectedResource);

        console.log("filteredConditiondata for all countries",  filteredConditionData);
        console.log("filteredResourcedata for all countries",  filteredResourceData);

        filteredResourceData.map(d=>{
            this.countryjoin[d.Country]=[+d.Metric_Value]
        })

        console.log(this.countryjoin)
        
        const projectionAR = d3.geoMercator().fitSize([this.width, this.height], state.geojson);
        const pathAR=d3.geoPath().projection(projectionAR)

        const z=d3.scaleSqrt()
            .domain(d3.extent(filteredConditionData, d=>d.Metric_Value))
            .range([0.01, 10])
        
        var circleColor = d3.scaleLinear()
            .domain([
            d3.min(filteredConditionData, function(d) { return d.Metric_Value; }),
            d3.max(filteredConditionData, function(d) { return d.Metric_Value; })
            ])
            .range(["#f56e14","white"]);

        var mapColor=d3.scaleLinear().domain([
            d3.min(filteredResourceData, function(d) { return d.Metric_Value; }),
            d3.max(filteredResourceData, function(d) { return d.Metric_Value; })])
            .range(["white","black"])

        console.log("Turkey color",mapColor(this.countryjoin["Turkey"]))
        console.log((this.countryjoin["Georgia"]))

        this.svg
          .selectAll(".countries")
          .data(state.geojson.features,d => d.properties.admin)
          .join("path")
          .attr("d", d => pathAR(d))
          .attr("class", "countries")
          .attr("fill", "white")
          .attr("fill", d=> mapColor(this.countryjoin[d.properties.admin]))

        

        //Bubbles
        const dot = this.svg.selectAll("circle")
          .data(filteredConditionData)
          .join("circle")
          .transition()
          .duration(this.duration/5) 
          .attr("class", "circle")
          .attr("fill",d => circleColor(d.Metric_Value))
          .attr("r", d=> z((d.Metric_Value)))
          .attr("fill-opacity", "0.8")
          .attr("stroke","#f56e14")
          .style("stroke-width", "1px")
          .attr("transform", d=>{
           const point =projectionAR([d.Longitude, d.Latitude])
           return `translate(${point[0]}, ${point[1]})`
          } )
        
        dot.select("circle")
        .on("mouseover", function(d) {                                                            
              console.log(d3.event.pageX)
              d3.select("#tooltip")
                .style("left", (d3.event.pageX)  + "px")
                .style("top", d3.event.pageY + "px")						
                .select("#country")
                .text(d.Country)
                .style("fill", "white")
              d3.select("#tooltip")       
                .select("#cases")
                .text(d.Metric_Value)
                .style("fill", "white")
              //Show the tooltip
              d3.select("#tooltip").classed("hidden", false);
              })  
          .on("mouseleave", function(d) {
                d3.select("#tooltip").classed("hidden", true);
              })  
          /* dot
              .on("mousemove", event => {
                // 1. get mouse x/y position
                const {clientX, clientY} = event
            
                // 2. invert the projection to go from x/y => lat/long
                // ref: https://github.com/d3/d3-geo#projection_invert
                const [long, lat] = projection.invert([clientX, clientY])
                state.hover=  {
                  screenPosition: [clientX, clientY], // will be array of [x,y] once mouse is hovered on something
                  mapPosition: [long, lat], // will be array of [long, lat] once mouse is hovered on something
                  // State_Name: d.State,
                  // Proverty_Rate: d.PovertyRate,
                  
                  visible: true
                }
                draw();
              }).on("mouseout", event=>{
                // hide tooltip when not moused over a state
                state.hover.visible = false
                draw(); // redraw
              }) */

    }

  }


export { Map };