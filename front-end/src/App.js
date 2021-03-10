import React from 'react';
import { Link, Redirect, Route, BrowserRouter  as Router, Switch } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './components/HomePage/HomePage';
import Login from './components/LoginPage/LoginPage';
import Registration from './components/RegistrationPage/RegistrationPage';
import { UserProfileContext } from './context/user-profile.context';
import { UserProfile } from './models/user-profile.model';
import { SessionStorageKey } from './session-storage/session-storage-key.enum';
import { SessionStorageManager } from './session-storage/session-storage-manager';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.userStateChanged = this.userStateChanged.bind(this);

    const currentState = SessionStorageManager.getItem(SessionStorageKey.UserProfile);

    if(currentState) {
      this.state = {
        accessToken: currentState.accessToken,
        info: currentState.info,
        isLoggedIn: currentState.isLoggedIn,
        userStateChanged: this.userStateChanged,
      }; 
    } else {
      this.state = {
        accessToken: {
          expiresInHours: 0,
          token: ''
        },
        info: {},
        isLoggedIn: false,
        userStateChanged: this.userStateChanged,
      }; 
    }
  }

  userStateChanged(userProfile) {
    this.setState(state => ({
      accessToken: userProfile.accessToken,
      info: userProfile.info,
      isLoggedIn: userProfile.isLoggedIn
    }));

    if(!userProfile.isLoggedIn) {
      SessionStorageManager.clear();
    } else {
      SessionStorageManager.setItem(SessionStorageKey.UserProfile, userProfile);
    }
  }

  handleLogout() {
    this.userStateChanged(new UserProfile());
  }

  render() {
    return <UserProfileContext.Provider value={this.state}><Router>
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/home"}>CompanyX</Link>

          { !this.state.isLoggedIn &&
            <div className="collapse navbar-collapse" id="loginregister">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={"/login"}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/registration"}>Register</Link>
                </li>
              </ul>
            </div>
          }
           { this.state.isLoggedIn &&
            <div className="collapse navbar-collapse" id="logout">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={"/login"} onClick={() => this.handleLogout()}>Logout</Link>
                </li>
              </ul>
            </div>
          }
        </div>
      </nav>

      
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/registration" component={Registration} />
            <Route path="/home" component={Home} />
            <Route to="/*" component={Login}/>
          </Switch>
          { this.state.isLoggedIn && <Redirect to="/home" /> }
      
    </div></Router></UserProfileContext.Provider>;
  }
}