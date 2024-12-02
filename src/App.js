import './App.css';
import React, {Component} from 'react';

class App extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      data: null
    }
  }

  readCsv = () => {
    var csvdata = []
    

    this.setState({data: csvdata})
  }

  componentDidMount() {
    this.readCsv()
  }

  render() {
    return (
      <div className="App">
        <h1 style={{marginLeft: "20px"}}>CS 450 Project Dashboard</h1>
        <div className="visualizations">

        </div>
      </div>
    );
  }
}

export default App;
