import React, {Component} from 'react';
import * as d3 from 'd3';

class Scatterplot3 extends Component {
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

    var filteredData = data.map(d => {return {Sleep_Duration: d.Sleep_Duration, Sleep_Quality: d.Sleep_Quality}});

    var margin = {top: 50, left: 50, right: 10, bottom: 50};
    var width = this.props.width;
    var height = this.props.height;

    var graph_width = width - margin.left - margin.right;
    var graph_height = height - margin.top - margin.bottom;

    var svg = d3.selectAll(".scatterplot3").select(".my_svg").attr("width", width).attr("height", height);
    var graph = svg.selectAll(".graph").data([null]).join("g").attr("transform", `translate(${margin.left}, ${margin.top})`).attr("class", "graph");
    
    //create axes
    var xScale = d3.scaleLinear().domain([d3.min(filteredData, d => d.Sleep_Duration), d3.max(filteredData, d => d.Sleep_Duration)]).range([0, graph_width]);
    var yScale = d3.scaleLinear().domain([0, 10.5]).range([graph_height, 0]);

    svg.selectAll(".x_axis").data([0]).join("g").attr("class", "x_axis").attr("transform", `translate(${margin.left}, ${height - margin.bottom})`).call(d3.axisBottom(xScale));
    svg.selectAll(".y_axis").data([0]).join("g").attr("class", "y_axis").attr("transform", `translate(${margin.left}, ${margin.top})`).call(d3.axisLeft(yScale));

    //label axes and add title
    svg.selectAll(".x_label").data([0]).join("text").attr("class", "x_label").attr("transform", `translate(${margin.left + graph_width/2}, ${height - margin.bottom + 40})`).attr("text-anchor", "middle").text("Sleep Duration")
    svg.selectAll(".y_label").data([0]).join("text").attr("class", "y_label").attr("text-anchor", "middle").attr("transform", `translate(${margin.left/2}, ${margin.top + graph_height/2}) rotate(-90)`).text("Sleep Quality")
    svg.selectAll(".title").data([0]).join("text").attr("class", "title").attr("transform", `translate(${margin.left + graph_width/2}, ${margin.top/2})`).attr("text-anchor", "middle").attr("dominant-baseline", "middle").text("Sleep Quality vs. Sleep Duration")

    //join data
    graph.selectAll("circle").data(filteredData).join("circle").attr("cx", d => xScale(d.Sleep_Duration)).attr("cy", d => yScale(d.Sleep_Quality)).attr("r", 4).attr("fill", "#404040");
  }

  render() {
    return (
      <div className="scatterplot3" style={{marginTop: "95px"}}>
        <svg className="my_svg"></svg>
      </div>
    );
  }
}

export default Scatterplot3;
