import React, {Component} from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Link
} from 'react-router-dom';
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
          <Router>
            <Switch>
              <Route exact path = '/'>
                <Login token = {token} />
              </Route>
              <Route exact path = '/test'>
                <Login token = {token} />
                <div> TEST </div>
              </Route>
            </Switch>
          </Router>
        </header>
      </div>
    )
  }
}

export default App;
