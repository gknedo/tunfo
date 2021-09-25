import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import About from "./pages/About";
import Menu from './components/organisms/Menu';

function App() {
  return(
  <Router>
      <div>
        <Menu />

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Users() {
  return <h2>Users</h2>;
}

export default App;
