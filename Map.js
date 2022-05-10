class Map {

    constructor(state, setGlobalState) {
        // initialize properties here
        this.width = window.innerWidth * 0.8;
        this.height = window.innerHeight * 0.75;        
        this.margins = { top: 200, bottom: 30, left: 0, right: 5 };
        this.duration = 1000;
        this.countryjoin =[]
    
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
       
        let mapData=state.geojson
        let metricData=state.countriesData

        let filteredConditionData=metricData.filter(d => d.Metric===state.selectedCondition);
        let filteredResourceData=metricData.filter(d => d.Metric===state.selectedResource);

        console.log("filteredConditiondata for all countries",  filteredConditionData);
        console.log("filteredResourcedata for all countries",  filteredResourceData);

        filteredResourceData.map(d=>{
            this.countryjoin[d.Country]=[+d.Metric_Value]
        })

        console.log(this.countryjoin)
        console.log(this.countryjoin["Greece"]["Metric_value"])
        
        
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
            .range(["white","#f86809"]);

        var mapColor=d3.scaleLinear().domain([
            d3.min(filteredResourceData, function(d) { return d.Metric_Value; }),
            d3.max(filteredResourceData, function(d) { return d.Metric_Value; })])
            .range(["white","black"])


        console.log("Georgia color",mapColor(this.countryjoin["Georgia"]))
        console.log("Turkey color",mapColor(this.countryjoin["Turkey"]))
        console.log("Latvia color",mapColor(this.countryjoin["Latvia"]))
        console.log((this.countryjoin["Georgia"]))

        this.svg
          .selectAll(".countries")
          .data(state.geojson.features,d => d.properties.admin)
          .join("path")
          .attr("d", d => pathAR(d))
          .attr("class", "countries")
          .attr("fill", "white")
          .attr("fill", d=> mapColor(this.countryjoin[d.properties.admin]))
          /* .on("mouseover", d => {
              // when the mouse rolls over this feature, do this
              state.hover["state"] = d.properties.NAME;
              draw(); // re-call the draw function when we set a new hoveredState
          }); */
        
        //Bubbles
        const dot = this.svg.selectAll("circle")
          .data(filteredConditionData)
          .join("circle")
          .attr("class", "circle")
          .attr("fill",d => circleColor(d.Metric_Value))
          .attr("r", d=> z((d.Metric_Value)))
          .attr("fill-opacity", "0.6")
          .attr("transform", d=>{
           const point =projectionAR([d.Longitude, d.Latitude])
           return `translate(${point[0]}, ${point[1]})`
          } )
          

    }

  }


export { Map };