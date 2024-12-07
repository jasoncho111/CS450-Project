import React, { Component } from 'react';
import * as d3 from 'd3';

class BoxWhisker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: 'University Year'
    };
  }

  componentDidMount() {
    if (this.props.data) this.renderChart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== prevProps.data || this.state.selectedYear !== prevState.selectedYear) {
      this.renderChart();
    }
  }

  computeBoxPlotStats(values) {
    const sorted = values.slice().sort(d3.ascending);
    const q1 = d3.quantile(sorted, 0.25);
    const median = d3.quantile(sorted, 0.5);
    const q3 = d3.quantile(sorted, 0.75);
    const iqr = q3 - q1;
    const lowerWhisker = Math.max(d3.min(sorted), q1 - 1.5 * iqr);
    const upperWhisker = Math.min(d3.max(sorted), q3 + 1.5 * iqr);
    return { q1, median, q3, lowerWhisker, upperWhisker };
  }

  renderChart() {
    const { data, width, height } = this.props;
    if (!data) return;
    let filteredData = data;
    if (this.state.selectedYear !== 'All') {
      filteredData = data.filter(d => d.University_Year === this.state.selectedYear);
    }
    const weekdayStartValues = filteredData.map(d => d.Weekday_Sleep_Start).filter(v => !isNaN(v));
    const weekendStartValues = filteredData.map(d => d.Weekend_Sleep_Start).filter(v => !isNaN(v));
    const weekdayEndValues = filteredData.map(d => d.Weekday_Sleep_End).filter(v => !isNaN(v));
    const weekendEndValues = filteredData.map(d => d.Weekend_Sleep_End).filter(v => !isNaN(v));
    const boxData = [
      { category: 'Sleep Start', group: 'Weekday', values: weekdayStartValues },
      { category: 'Sleep Start', group: 'Weekend', values: weekendStartValues },
      { category: 'Sleep End', group: 'Weekday', values: weekdayEndValues },
      { category: 'Sleep End', group: 'Weekend', values: weekendEndValues }
    ];

    boxData.forEach(d => {
      if (d.values.length > 0) {
        const stats = this.computeBoxPlotStats(d.values);
        d.stats = stats;
      } else {
        d.stats = { q1:0, median:0, q3:0, lowerWhisker:0, upperWhisker:0 };
      }
    });

    d3.select(this.refs.chart).selectAll("*").remove();
    const margin = { top: 50, right: 50, bottom: 50, left: 60 };
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const svg = d3.select(this.refs.chart)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    const categories = [...new Set(boxData.map(d => d.category))]; 
    const groups = ['Weekday', 'Weekend'];

    const x0 = d3.scaleBand()
      .domain(categories)
      .range([0, w])
      .paddingInner(0.3);
    const x1 = d3.scaleBand()
      .domain(groups)
      .range([0, x0.bandwidth()])
      .padding(0.5);

    const y = d3.scaleLinear()
      .domain([0, 24]).nice()
      .range([h, 0]);
    const xAxis = d3.axisBottom(x0);
    const yAxis = d3.axisLeft(y);

    g.append('g')
      .attr('transform', `translate(0, ${h})`)
      .call(xAxis);

    g.append('g')
      .call(yAxis);

    g.append('text')
      .attr('class', 'y_label')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${-margin.left+20}, ${h/2}) rotate(-90)`)
      .text('Time (hours)');

    g.append('text')
      .attr('class', 'title')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${w/2}, ${-margin.top/2+10})`)
      .text('Weekday vs. Weekend Sleep Start/End Times');

    const boxWidth = x1.bandwidth();

    const boxGroups = g.selectAll('.boxGroup')
      .data(boxData)
      .join('g')
      .attr('transform', d => `translate(${x0(d.category) + x1(d.group)},0)`);

    boxGroups.append('line')
      .attr('class', 'whisker')
      .attr('x1', boxWidth/2)
      .attr('x2', boxWidth/2)
      .attr('y1', d => y(d.stats.lowerWhisker))
      .attr('y2', d => y(d.stats.upperWhisker))
      .attr('stroke', 'black');

    boxGroups.append('line')
      .attr('class', 'whisker-cap')
      .attr('x1', 0)
      .attr('x2', boxWidth)
      .attr('y1', d => y(d.stats.lowerWhisker))
      .attr('y2', d => y(d.stats.lowerWhisker))
      .attr('stroke', 'black');

    boxGroups.append('line')
      .attr('class', 'whisker-cap')
      .attr('x1', 0)
      .attr('x2', boxWidth)
      .attr('y1', d => y(d.stats.upperWhisker))
      .attr('y2', d => y(d.stats.upperWhisker))
      .attr('stroke', 'black');

    boxGroups.append('rect')
      .attr('class', 'box')
      .attr('x', 0)
      .attr('y', d => y(d.stats.q3))
      .attr('width', boxWidth)
      .attr('height', d => Math.max(y(d.stats.q1)-y(d.stats.q3),0))
      .attr('fill', '#69b3a2')
      .attr('stroke', 'black');

    boxGroups.append('line')
      .attr('class', 'median')
      .attr('x1', 0)
      .attr('x2', boxWidth)
      .attr('y1', d => y(d.stats.median))
      .attr('y2', d => y(d.stats.median))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    const uniqueYears = ['University Year', ...new Set(this.props.data.map(d => d.University_Year))];
    d3.select(this.refs.dropdownContainer).selectAll("select").data([0]).join(
      enter => {
        const select = enter.append("select");
        select.selectAll("option")
          .data(uniqueYears)
          .enter()
          .append("option")
          .attr("value", d => d)
          .text(d => d);
        select.on("change", (event) => {
          this.setState({selectedYear: event.target.value});
        });
      },
      update => {
        update.selectAll("option").data(uniqueYears)
          .join("option")
          .attr("value", d => d)
          .text(d => d);
      }
    );
  }

  render() {
    return (
      <div className="boxWhiskerChart">
        <div ref="dropdownContainer" style={{marginBottom: '10px'}}></div>
        <svg ref="chart"></svg>
      </div>
    );
  }
}

export default BoxWhisker;
