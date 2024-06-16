import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../src/pages/home";
import Magazalar from "../src/pages/magazalar";
import Products from "../src/pages/products";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/users" component={Magazalar} />
        <Route path="/products" component={Products} />
      </Switch>
    </Router>
  );
};

export default App;
