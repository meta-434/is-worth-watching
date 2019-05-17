import React, { Component } from "react";
import axios from "axios";
import "./App.css";

const TMDB_API_KEY = "28c71925f5aad6fe8b7eb0161431ad96";

const posterUrlMaker = imgId => {
  return "http://image.tmdb.org/t/p/w154".concat(imgId)
}

const queryUrlMaker = title => {

}

const mapResults = result => {
  return result.map(row => 
  <div>
    <h3>{row.title}</h3>
    <img src={posterUrlMaker(row.poster_path)} alt={row.title} />
    <p>Overview: {row.overview} </p>
    <p>Release Date: {row.release_date} ,
    ID: {row.id} </p>
  </div>);
};

class App extends Component {
  state = {
    result: null
  };
  componentDidMount() {
    axios.get("https://api.themoviedb.org/3/search/movie?api_key="+TMDB_API_KEY+"&query=Ocean's").then(response => {
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
          <input type="text" name="searchText" />
          a good movie?
        </h1>
      </span>
      <form>
        <input type="submit" value="Submit" />
      </form>
      {this.state.result !== null && mapResults(this.state.result)}
      </div>
    );
  }
}

export default App;