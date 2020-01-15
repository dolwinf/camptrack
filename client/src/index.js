import React, { useContext, useReducer } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Context from "./context";
import reducer from "./reducer";

import ProtectedRoute from "../src/ProtectedRoute";
import App from "./pages/App";
import Splash from "./pages/Splash";

import "mapbox-gl/dist/mapbox-gl.css";

const Root = () => {
  const initialState = useContext(Context);
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);
  return (
    <Router>
      <Context.Provider value={{ state, dispatch }}>
        <Switch>
          <ProtectedRoute exact path="/" component={App} />
          <Route path="/login" component={Splash} />
        </Switch>
      </Context.Provider>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
