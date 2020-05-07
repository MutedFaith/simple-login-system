import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";
import About from "./components/about";
import Register from "./components/register";
import NotFound from "./components/noFound";
import "./App.css";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/home" component={Home} exact />
          <Route path="/about" component={About} />
          <Route path="/register" component={Register} />
          <Route component={NotFound} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
