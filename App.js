import React, { Component } from "react";
import 'typeface-roboto';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from "axios";
import "./App.css";
import { TextField } from "@material-ui/core";

const TMDB_API_KEY = "28c71925f5aad6fe8b7eb0161431ad96";
const OMDB_API_KEY = "9c9b98e3"


class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {result: null, queryTitle: null, realName: null, posterUrl: null, ratingInfo: null, popularity : null};
    this._handleClick = this._handleClick.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  /*makes url for thumbnail image as TMDB allows user to specify size in API call.*/
  posterUrlMaker = (imgId) => {
    return "http://image.tmdb.org/t/p/w154".concat(imgId)
  }

  /*handles the click of the 'tile' (button) of the movie you want to see
  results for */
  _handleClick = (event) => {
    event.persist()
    this.apiCallSingular(event);
  }

  /* handles the 'enter' press required to submit the text box value*/
  _handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.setState({queryTitle: event.target.value});
      this.apiCallTitle(event);
      
    }
  }

  /* makes calls to TMDB based on a keyword. TMDB is used for the initial
  search because it is much better at searching with incomplete titles and 
  returning more results for matches than OMDB.*/
  apiCallTitle(event) {
    axios.get("https://api.themoviedb.org/3/search/movie?api_key=" + TMDB_API_KEY + "&query=" + event.target.value).then(response => {
      console.log(response.data);
      const data = response.data.results;
      this.setState({ result: data});
    });
  }

  /*apiCallSingular - this makes calls to OMDB which has a much more comprehensive 
  review aggregation than TMDB, but has a way worse search functionality.*/
  apiCallSingular = event => {
    axios.get("http://www.omdbapi.com/?t=" + event.target.alt + "&apikey=" + OMDB_API_KEY).then(response => {
      console.log(response.data.Ratings)
      this.setState({result : response.data, realName : event.target.alt, posterUrl : event.target.currentSrc, ratingInfo: response.data.Ratings})
    });
  }

  /*mapResults -- Takes result state value and identifies if it's a response from 
  TMDB or OMDB (based on the structure of the JSON response) and formats the 
  appropriate data from the state value of result based on that identification.*/
  mapResults = result => {
    if (0 in this.state.result) {
      return result.map(row => 
              <Grid item xs={3}>
                <Paper>
                  <Button onClick={this._handleClick}>
                    <img src={this.posterUrlMaker(row.poster_path)} alt={row.title} hspace="20"/>
                    <p><b>{row.title}</b>
                    <br />Popularity: {row.popularity}
                    <br />Release Date: {row.release_date}</p> 
                </Button>
              </Paper>
            </Grid>
         );
    } else if (this.state.results !== undefined && this.state.realName !== 'undefined'){
      return (
        <Grid container direction="column" alignItems="center" justify="center">
          <Button>
            <img src={this.state.posterUrl} alt={this.state.realName} />
            <p><b>{this.state.realName}</b>
              <br />Ratings: {this.state.ratingInfo.map(item => 
                <p>
                  Source: {item.Source}, rating: {item.Value}
                </p>
              )}
            </p>
          </Button>
        </Grid>
      );
    } else {
      alert("This movie doesn't have ratings on any popular review sites...")
      return (
        <Grid container direction="column" alignItems="center" justify="center">
          <Button onClick={() => window.location.reload()}>
            <h3>{this.state.realName}</h3>
            <img src={this.state.posterUrl} alt={this.state.realName} />
            <div>
              Sorry... Try again.
            </div>
          </Button>
        </Grid>
      );
    }
  };

  /*Render Method*/
  render() {
    return (
      <div className="App">
      <span>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <h1> Is </h1>
          </Grid>
          <Grid item xs={12}>
            <TextField id="outlined-name" variant="outlined" label="Title" onKeyDown={this._handleKeyDown} />  
          </Grid>
          <Grid item xs={12}>    
            <h1> a good movie? </h1>
          </Grid> 
        </Grid>
      </span>
        <p>click the poster of the movie you're interested in...</p>
        <div>
          <Grid container spacing={24}>
            {this.state.result !== null && this.mapResults(this.state.result)}
          </Grid>
        </div>
      
      </div>
    );
  }
}

export default App;