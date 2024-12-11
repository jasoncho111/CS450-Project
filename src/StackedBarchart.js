import React, { Component } from 'react';
import * as d3 from "d3";
import { sliderBottom } from 'd3-simple-slider';
import './StackedBarchart.css'

// TODO: Add Slider for Age that goes from min to max and changes the points accordingly via filtering the data for x age (make a copy of csv)

// Scatterplot 
class StackedBarchart extends Component{
  constructor(props){
    super(props);
    this.state = {
      ageRange: [18, 25]
    };
  }

  componentDidMount() {
    if (this.props.data) this.renderChart();
  }

  componentDidUpdate() {
    if (this.props.data) this.renderChart();
  }

  renderChart = () => {
    var data = this.props.data.filter(d => d.Age >= this.state.ageRange[0] && d.Age <= this.state.ageRange[1]);
    data = data.map(d => {return {Caffeine_Intake: d.Caffeine_Intake, Age: d.Age, Gender: d.Gender}})
    console.log("Data", data)
  
    const margin = { top: 30, right: 100, bottom: 50, left: 50 };
    const width = this.props.width;
    const height = this.props.height;

    const graph_width = width - margin.left - margin.right, graph_height = height - margin.top - margin.bottom;
    
    var svg = d3.select(".stackedBarChart").select(".my_svg").attr("width", width).attr("height", height);
    var graph = svg.selectAll(".graph").data([0]).join("g").attr("transform", `translate(${margin.left}, ${margin.top})`).attr("class", "graph");

    //create tooltip window
    const tooltip = d3.select(".stackedBarChart").selectAll(".tooltip")
      .data([0])
      .join("div")
      .attr("class", "tooltip")
      .style("opacity", 0); 
    
    //create axes
    //reformat data
    var comp = [];
    for (var i = 0; i < 6; i++) {
        comp.push({Caffeine_Intake: i, Male: 0, Female: 0, Other: 0})
    }
    data.forEach(d => {
        comp[d.Caffeine_Intake][d.Gender] += 1;
    })
    console.log(comp);

    var xScale = d3.scaleBand().domain(comp.map(d => d.Caffeine_Intake)).range([0, graph_width]).padding(0.2);
    var maxSum = d3.max(comp, d => d.Male + d.Female + d.Other);
    var yScale = d3.scaleLinear().domain([0, maxSum]).range([graph_height, 0]);
    
    svg.selectAll(".x_axis").data([0]).join("g").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`).attr("class", "x_axis").call(d3.axisBottom(xScale));
    svg.selectAll(".y_axis").data([0]).join("g").attr("transform", `translate(${margin.left}, ${margin.top})`).attr("class", "y_axis").call(d3.axisLeft(yScale));

    //create labels and title
    svg.selectAll(".x_label").data([0]).join("text").attr("class", "x_label").attr("transform", `translate(${margin.left + graph_width/2}, ${height - margin.bottom + 40})`).attr("text-anchor", "middle").text("Caffeine Intake (Number of Beverages per Day)");
    svg.selectAll(".y_label").data([0]).join("text").attr("class", "y_label").attr("text-anchor", "middle").attr("transform", `translate(${margin.left/2 - 10}, ${margin.top + graph_height/2}) rotate(-90)`).text("Number of People");
    svg.selectAll(".title").data([0]).join("text").attr("class", "title").attr("text-anchor", "middle").attr("transform", `translate(${margin.left + graph_width/2}, ${margin.top/2})`).text("Number of People vs. Caffeine Intake");

    //create legend
    var colors = {Male: "#2986cc", Female: "#f90046", Other: "#69b3a2"}
    var squareSize = 24;
    var legend_g = svg.selectAll(".legend").data([0]).join("g").attr("class", "legend").attr("transform", `translate(${width - margin.right + 20}, ${margin.top})`);
    var makeLegendLine = (key, sy) => {
        var f_key = key.replace(".", "")
        legend_g.selectAll(`#${f_key}_square`).data([0]).join("rect").attr("x", 0).attr("y", sy).attr("width", squareSize).attr("height", squareSize).attr("id", `${f_key}_square`).attr("stroke", "None").attr("fill", colors[key]);
        legend_g.selectAll(`#${f_key}_text`).data([0]).join("text").attr("x", squareSize+6).attr("y", sy + squareSize/2).attr("id", `${f_key}_text`).text(key).attr("dominant-baseline", "middle").attr("font-size", "12px");
    };

    makeLegendLine("Other", 0)
    makeLegendLine("Female", 34)
    makeLegendLine("Male", 68)

    //create bars
    var stackGen = d3.stack().keys(["Male", "Female", "Other"]);
    var stackSeries = stackGen(comp);
    console.log(stackSeries);
    var keys = Object.keys(colors);
    keys.forEach(k => {
        graph.selectAll(`.${k}_rect`).data(stackSeries[keys.indexOf(k)]).join("rect").attr("class", `${k}_rect`).attr("x", d => xScale(d.data.Caffeine_Intake)).attr("y", d => yScale(d[1])).attr("width", xScale.bandwidth()).attr("height", d => yScale(d[0]) - yScale(d[1])).attr("fill", colors[k])
        .on("mouseover", (event, d) => {
            var date = d.Date;
            tooltip.html(`Caffeine Intake: ${d.data.Caffeine_Intake}<br>Male: ${d.data.Male}<br>Female: ${d.data.Female}<br>Other: ${d.data.Other}<br>Total: ${d.data.Male + d.data.Female + d.data.Other}`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY + 5) + "px")
            .style("opacity", 0.90);
        })
        .on("mousemove", (event) => {
            tooltip.style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY + 5) + "px")
        })
        .on("mouseout", () => {
            tooltip.style("opacity", 0);
        });
    }) 

    // Create the slider
    const minAge = d3.min(this.props.data, d => d.Age), maxAge = d3.max(this.props.data, d => d.Age);
    const sliderRange = sliderBottom()
      .min(minAge)
      .max(maxAge)
      .step(1)
      .width(300)
      .ticks(maxAge - minAge)
      .default([minAge, maxAge])
      .fill('#85bb65')
      .on('onchange', val => {
          this.setState({ ageRange: [val[0], val[1]] });
      });

      // Add the slider to the page
      const gRange = d3.select(".stackedBarChart").select('.slider-range')
        .attr('width', graph_width)
        .attr('height', 100)
        .selectAll('.slider-g')
        .data([null])
        .join('g')
        .attr('class', 'slider-g')
        .attr('transform', 'translate(90,30)');

      gRange.call(sliderRange);

      gRange.selectAll('.tick text').style('opacity', 1);
      
      d3.select(".stackedBarChart").select(".slider-range").selectAll(".slider_label").data([0]).join("text").attr("class", "slider_label").attr("transform", "translate(30, 30)").attr("dominant-baseline", "middle").text("Age:");
  }
  
  render() {
    return (
      <div className="stackedBarChart">
        <div id="sliderContainer">
          <svg className="slider-range"></svg>
        </div>
        <svg className="my_svg"></svg>
    </div>
    )
  };
}

export default StackedBarchart;