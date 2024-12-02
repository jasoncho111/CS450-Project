import React, { Component } from 'react';
import * as d3 from "d3";

// TODO: Add Slider for Age that goes from min to max and changes the points accordingly via filtering the data for x age (make a copy of csv)

// Scatterplot 
class Scatterplot extends Component{
  constructor(props){
    super(props);
    this.state = {
      age: "18"
    };
  }

  handleSliderChange = (event) => {
    this.setState({ age: event.target.value });
  }

  componentDidUpdate() {
    const data = this.props.data.filter(d => d.age == this.state.age);
  
    const margin = { top: 30, right: 30, bottom: 70, left: 50 };
    const w = 500 - margin.left - margin.right;
    const h = 300 - margin.top - margin.bottom;
  
    const container = d3.select(".Scatterplot_svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .select(".g_1")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X-Axis
    const x_data = data.map(d => d.study_hours);
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
    const y_data = data.map(d => d.sleep_duration);
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
      .attr("cx", d => x_scale(d.study_hours))
      .attr("cy", d => y_scale(d.sleep_duration))
      .attr("r", 3)
      .style("fill", d =>
        d.gender === "Male" ? "#0000ff" : d.gender === "Female" ? "#ff0000" : "#69b3a2"
      );
  
  
  

      container.selectAll(".scatterplot-title").remove(); // Remove old labels

    // Title and Axis Labels
    // Add Title Label
    container.append('text')
    .attr("class", "scatterplot-title")
    .attr('x', margin.top)
    .attr('y', margin.left - 65)
    .text(`Sleep Duration vs Study Hours by Gender for Age ${this.state.age}`);

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
  }
  
  render() {
    return (
      <div id="sliderContainer">
        <input type="range" name="ageSlider" id="ageSlider" min="18" max="25" value={this.state.age} onChange={this.handleSliderChange}/>
        <br/>
        <svg className="Scatterplot_svg">
          <g className="g_1"></g>
        </svg>
    </div>
    )
  };
}

export default Scatterplot;