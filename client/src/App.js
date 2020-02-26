import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css';
import Navbar from '../src/Components/layout/Navbar';
import Landing from '../src/Components/layout/Landing';
import Login from '../src/Components/auth/Login';
import Register from '../src/Components/auth/Register';

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path='/' component={Landing} />
      <section className="container">
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />

        </Switch>
      </section>
    </Fragment>
  </Router>
);

export default App;
