import './App.css';
import React, {Component} from 'react';
import Papa from 'papaparse';
import Scatterplot3 from './Scatterplot3';
import Scatterplot1 from './Scatterplot1';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: null
    }
  }

  readCsv = () => {
    var csvdata = []
    
    const csvFilePath = process.env.PUBLIC_URL + '/student_sleep_patterns.csv'

    fetch(csvFilePath)
      .then((response) => response.text())
      .then((csvText) => {
        //parse the CSV text
        Papa.parse(csvText, {
          header: true, //json i think
          skipEmptyLines: true,
          complete: (result) => {
            console.log('Parsed Data:', result.data);
            this.setState({ data: result.data });
          },
        });
      })
      .catch((error) => {
        console.error('Error reading the CSV file:', error);
      });
  };

  componentDidMount() {
    this.readCsv()
  }

  render() {
    return (
      <div className="App">
        <h1 style={{marginLeft: "20px"}}>CS 450 Project Dashboard</h1>
        <div className="visualizations">
          <Scatterplot1 data={this.state.data} width={500} height={300}></Scatterplot1>
          <Scatterplot3 data={this.state.data} width={600} height={450}></Scatterplot3>
        </div>
      </div>
    );
  }
}

export default App;
