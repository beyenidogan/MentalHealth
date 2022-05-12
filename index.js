// import our components
import { Bar } from "./Bar.js";
import { Map } from "./Map.js"; 

let bar, map;

// global state
let state = {
  countriesData: [],
  worldData: [],
  geojson:null,
  listResource:["Facilities","Healthcare Professionals","Beds"],
  listCondition: ["Mental health disorders","Substance use disorders","Alcohol use disorders","Eating disorders"],
  selectedResource: "Facilities",
  selectedCondition: "Mental health disorders",
}
Promise.all([
  d3.json("./data/world-110m.geo.json"),
  d3.csv("./data/Countries_Health_agg_long.csv", d3.autoType),
  d3.csv("./data/World_Health_agg.csv", d3.autoType),
]).then(([geojson, countriesdata, worlddata]) => {
    state.geojson = geojson;
    console.log("geojson", state.geojson);
    state.countriesData = countriesdata;
    console.log("countriesData",  state.countriesData,);
    state.worldData=worlddata;
    console.log("worldData",  state.worldData);
    init()
});


function init() {
  bar= new Bar(state, setGlobalState);
  map = new Map(state, setGlobalState);  
  draw();
}

function draw() {
  bar.draw(state,setGlobalState);
  map.draw(state, setGlobalState); 
}

// UTILITY FUNCTION: state updating function that we pass to our components so that they are able to update our global state object
function setGlobalState(nextState) {
  state = { ...state, ...nextState };
  console.log("new state:", state);
  draw();
}