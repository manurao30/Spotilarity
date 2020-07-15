import React, {Component} from 'react';
import Login from './Components/Login/Login.js';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  render() {
    const params = this.getHashParams();
    const token = params.access_token;
    return (
      <div className="App">
        <header className="App-header">
          <Login token = {token} />
        </header>
      </div>
    )
  }
}

export default App;
