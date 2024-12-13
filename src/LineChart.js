import React, {Component} from 'react';
import * as d3 from 'd3';

class LineChart extends Component {
  componentDidMount() {
    if (this.props.data) this.renderChart();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      if (this.props.data) this.renderChart();
    }
  }
    
  renderChart = () => {
    var data = this.props.data;
  
    // Group data by Screen_Time and calculate the average Physical_Activity
    var groupedData = d3.rollup(
      data,
      v => d3.mean(v, d => d.Physical_Activity),
      d => d.Screen_Time
    );
  
    var filteredData = Array.from(groupedData, ([Screen_Time, Physical_Activity]) => ({ Screen_Time, Physical_Activity }));
  
    // Sort the data by Screen_Time to ensure the line goes from left to right
    filteredData.sort((a, b) => a.Screen_Time - b.Screen_Time);
  
    var margin = {top: 50, left: 50, right: 10, bottom: 50};
    var width = this.props.width;
    var height = this.props.height;
  
    var graph_width = width - margin.left - margin.right;
    var graph_height = height - margin.top - margin.bottom;
  
    var svg = d3.selectAll(".linechart").select(".my_svg").attr("width", width).attr("height", height);
    var graph = svg.selectAll(".graph").data([null]).join("g").attr("transform", `translate(${margin.left}, ${margin.top})`).attr("class", "graph");
    
    // create scales
    var xScale = d3.scaleLinear().domain(d3.extent(filteredData, (d) => d.Screen_Time)).range([0, graph_width]);
    var yScale = d3.scaleLinear().domain(d3.extent(filteredData, (d) => d.Physical_Activity)).range([graph_height, 0]);
  
    // create axes
    svg.selectAll(".x_axis").data([0]).join("g").attr("class", "x_axis").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`).call(d3.axisBottom(xScale));
    svg.selectAll(".y_axis").data([0]).join("g").attr("class", "y_axis").attr("transform", `translate(${margin.left}, ${margin.top})`).call(d3.axisLeft(yScale));
  
    svg.selectAll(".x_label").data([0]).join("text").attr("class", "x_label").attr("transform", `translate(${margin.left + graph_width / 2}, ${height - margin.bottom + 40})`).attr("text-anchor", "middle").text("Screen Time");
    svg.selectAll(".y_label").data([0]).join("text").attr("class", "y_label").attr("text-anchor", "middle").attr("transform", `translate(${margin.left / 2}, ${margin.top + graph_height / 2}) rotate(-90)`).text("Physical Activity");
    svg.selectAll(".title").data([0]).join("text").attr("class", "title").attr("transform", `translate(${margin.left + graph_width / 2}, ${margin.top / 2})`).attr("text-anchor", "middle").attr("dominant-baseline", "middle").text("Screen Time vs. Physical Activity");
  
    // Plot points (circles)
    graph.selectAll(".point")
      .data(filteredData)
      .join("circle")
      .attr("class", "point")
      .attr("cx", (d) => xScale(d.Screen_Time)) 
      .attr("cy", (d) => yScale(d.Physical_Activity))  
      .attr("r", 4) 
      .attr("fill", "#404040"); 
  
    // Create line function
    var line = d3.line()
      .x((d) => xScale(d.Screen_Time))  
      .y((d) => yScale(d.Physical_Activity)); 
  
    // Plot the line through the points
    graph.selectAll(".line")
      .data([filteredData])
      .join("path")
      .attr("class", "line")
      .attr("d", line)  
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2);
  }
  
  
  render() {
    return (
      <div className="linechart">
        <svg className="my_svg"></svg>
      </div>
    );
  }
}

export default LineChart;