import React, { Component } from 'react';
import * as d3 from "d3";
import { sliderBottom } from 'd3-simple-slider';

// TODO: Add Slider for Age that goes from min to max and changes the points accordingly via filtering the data for x age (make a copy of csv)

// Scatterplot 
class Scatterplot1 extends Component{
  constructor(props){
    super(props);
    this.state = {
      ageRange: [18, 25]
    };
  }

  handleSliderChange = (event) => {
    this.setState({ age: event.target.value });
  }

  componentDidMount() {
    if (this.props.data) this.renderChart();
  }

  componentDidUpdate(prevProps) {
    if (this.props.data) this.renderChart();
  }

  renderChart = () => {
    const data = this.props.data.filter(d => d.Age >= this.state.ageRange[0] && d.Age <= this.state.ageRange[1]);
    console.log("Data", data)
  
    const margin = { top: 30, right: 30, bottom: 70, left: 50 };
    const w = this.props.width - margin.left - margin.right;
    const h = this.props.height - margin.top - margin.bottom;
  
    const container = d3.select(".scatterplot1").select(".Scatterplot_svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .select(".g_1")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X-Axis
    const x_data = data.map(d => d.Study_Hours);
    console.log(x_data)
    const x_scale = d3.scaleLinear()
      .domain([Math.floor(d3.min(x_data)), Math.ceil(d3.max(x_data))])
      .range([0, w]);
    
    container.selectAll(".x_axis_g")
      .data([0])
      .join("g")
      .attr("class", "x_axis_g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(x_scale).ticks(5)); // Adjust tick count if needed
  
    // Y-Axis
    const y_data = data.map(d => d.Sleep_Duration);
    const y_scale = d3.scaleLinear()
      .domain([Math.floor(d3.min(y_data)), Math.ceil(d3.max(y_data))])
      .range([h, 0]);
  
    container.selectAll(".y_axis_g")
      .data([0])
      .join("g")
      .attr("class", "y_axis_g")
      .attr("transform", `translate(0, 0)`)
      .call(d3.axisLeft(y_scale).ticks(5));
  
    // Points
    container.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", d => x_scale(d.Study_Hours))
      .attr("cy", d => y_scale(d.Sleep_Duration))
      .attr("r", 3)
      .style("fill", d =>
        d.Gender === "Male" ? "#0000ff" : d.Gender === "Female" ? "#ff0000" : "#69b3a2"
      );

      container.selectAll(".scatterplot-title").remove(); // Remove old labels

    // Title and Axis Labels
    // Add Title Label
    container.append('text')
    .attr("class", "scatterplot-title")
    .attr('x', w/2)
    .attr('y', -15)
    .attr("text-anchor", "middle")
    .text(`Sleep Duration vs Study Hours by Gender`);

    container.append("text")
      .attr("class", "custom-labels")
      .attr("x", w / 2)
      .attr("y", h + margin.bottom - 20)
      .attr("text-anchor", "middle")
      .text("Study Hours");
  
    container.append("text")
      .attr("class", "custom-labels")
      .attr("transform", "rotate(-90)")
      .attr("x", -h / 2)
      .attr("y", -margin.left + 20)
      .attr("text-anchor", "middle")
      .text("Sleep Duration");

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
      const gRange = d3.select(".scatterplot1").select('.slider-range')
        .attr('width', w)
        .attr('height', 100)
        .selectAll('.slider-g')
        .data([null])
        .join('g')
        .attr('class', 'slider-g')
        .attr('transform', 'translate(90,30)');

      gRange.call(sliderRange);

      gRange.selectAll('.tick text').style('opacity', 1);
  }
  
  render() {
    return (
      <div className="scatterplot1">
        <div id="sliderContainer">
          <svg className="slider-range"></svg>
      </div>
      <br/>
        <svg className="Scatterplot_svg">
          <g className="g_1"></g>
        </svg>
    </div>
    )
  };
}

export default Scatterplot1;