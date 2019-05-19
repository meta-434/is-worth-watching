import React, { Component } from "react";
import axios from "axios";
import "./App.css";

const TMDB_API_KEY = "28c71925f5aad6fe8b7eb0161431ad96";

const posterUrlMaker = imgId => {
  return "http://image.tmdb.org/t/p/w154".concat(imgId)
}

const mapResults = result => {
  return result.map(row => 
  <div>
    <button onClick={() => console.log("selection works!")}>
      <h3>{row.title}</h3>
      <img src={posterUrlMaker(row.poster_path)} alt={row.title} />
      <p>Popularity: {row.popularity} </p>
      <p>Release Date: {row.release_date}</p> 
      <p>ID: {row.id} </p>
    </button>
  </div>);
};

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {result: null, queryTitle: null};

    this._handleKeyDown = this._handleKeyDown.bind(this);
  }


  _handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.setState({queryTitle: event.target.value});
      console.log(event.target.value)
      this.apiCallTitle(event);
    }
  }

  apiCallID(event) {
    axios.get().then(response => {
      console.log(response.data.results);
      const data = response.data.resutls;
      this.setState({result : data})
    });
  }

  apiCallTitle(event) {
    axios.get("https://api.themoviedb.org/3/search/movie?api_key=" + TMDB_API_KEY + "&query=" + event.target.value).then(response => {
      console.log(response.data.results);
      const data = response.data.results;
      this.setState({ result: data });
    });
  }

  render() {
    return (
      <div className="App">
      <span>
        <h1>
          is 
          <span>
            <input type="text" onKeyDown={this._handleKeyDown} />       
          </span>
          a good movie?
        </h1>
      </span>
      {this.state.result !== null && mapResults(this.state.result)}
      </div>
    );
  }
}

export default App;