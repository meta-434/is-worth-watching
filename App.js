import React, { Component } from "react";
import axios from "axios";
import "./App.css";

const TMDB_API_KEY = "28c71925f5aad6fe8b7eb0161431ad96";
const OMDB_API_KEY = "9c9b98e3"

const posterUrlMaker = imgId => {
  return "http://image.tmdb.org/t/p/w154".concat(imgId)
}


class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {result: null, queryTitle: null, realName: null, posterUrl: null, ratingInfo: null};

    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  _handleClick = (event) => {
    event.persist()
    this.apiCallSingular(event);
  }

  _handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.setState({queryTitle: event.target.value});
      this.apiCallTitle(event);
      
    }
  }

  apiCallTitle(event) {
    axios.get("https://api.themoviedb.org/3/search/movie?api_key=" + TMDB_API_KEY + "&query=" + event.target.value).then(response => {
      console.log(response.data);
      const data = response.data.results;
      this.setState({ result: data });
    });
  }

  apiCallSingular = event => {
    axios.get("http://www.omdbapi.com/?t=" + event.target.alt + "&apikey=" + OMDB_API_KEY).then(response => {
      console.log(response.data.Ratings)
      this.setState({result : response.data, realName : event.target.alt, posterUrl : event.target.currentSrc, ratingInfo: response.data.Ratings})
    });
  }

  mapResults = result => {
    if (0 in this.state.result) {
      return result.map(row => 
      <div>
        <button onClick={this._handleClick}>
          <h3>{row.title}</h3>
          <img src={posterUrlMaker(row.poster_path)} alt={row.title} />
          <p>Title : {row.title}</p>
          <p>Popularity: {row.popularity} </p>
          <p>Release Date: {row.release_date}</p> 
          <p>ID: {row.id} </p>
        </button>
      </div>);
    } else {
      return (
        <div>
          <h3>{this.state.realName}</h3>
          <img src={this.state.posterUrl} alt={this.state.realName} />
          <div>
            Ratings:
            {this.state.ratingInfo.map(item => 
              <div>
                Source: {item.Source}, rating: {item.Value}
              </div>
              )}
          </div>
        </div>
      );
    }
  };

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
      {this.state.result !== null && this.mapResults(this.state.result)}
      </div>
    );
  }
}

export default App;