import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import About from "./pages/About";
import Jungle from './pages/Jungle';
import Menu from './components/organisms/Menu';

function App() {
  return(
  <Router>
      <div>
        <Menu />

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <About />
          </Route>
          <Route exact path="/jungle">
            <Jungle />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
