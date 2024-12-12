import React, { Component } from 'react';
import Papa from 'papaparse'

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
  }
  
  handleFileSubmit = (event) => {
    event.preventDefault();
    const { file } = this.state;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        this.csvToJson(text);
      };
      reader.readAsText(file);
    }
  };

  csvToJson = (csv) => {
    Papa.parse(csv, {
        header: true, //json i think
        skipEmptyLines: true,
        complete: (result) => {
            console.log('Parsed Data:', result.data);
            result.data = result.data.map(d => {
            return {
                Student_ID: parseInt(d.Student_ID),
                Age: parseInt(d.Age),
                Gender: d.Gender,
                University_Year: d.University_Year,
                Sleep_Duration: parseFloat(d.Sleep_Duration),
                Study_Hours: parseFloat(d.Study_Hours),
                Screen_Time: parseFloat(d.Screen_Time),
                Caffeine_Intake: parseInt(d.Caffeine_Intake),
                Physical_Activity: parseInt(d.Physical_Activity),
                Sleep_Quality: parseInt(d.Sleep_Quality),
                Weekday_Sleep_Start: parseFloat(d.Weekday_Sleep_Start),
                Weekday_Sleep_End: parseFloat(d.Weekday_Sleep_End),
                Weekend_Sleep_Start: parseFloat(d.Weekend_Sleep_Start),
                Weekend_Sleep_End: parseFloat(d.Weekend_Sleep_End)
            }
            })
            this.props.set_data(result.data)
        },
    });
  };

  render() {
    return (
      <div style={{ backgroundColor: "#f0f0f0", padding: 20 }}>
        <h2>Upload a CSV File</h2>
        <form onSubmit={this.handleFileSubmit}>
          <input type="file" accept=".csv" onChange={(event) => this.setState({ file: event.target.files[0] })} />
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default FileUpload;