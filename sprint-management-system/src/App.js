import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

class SignUpComponent extends React.Component {
  render () {
    return (
      <form>
        <div className="form-group row justify-content-center">
          <label className="col-sm-1 col-form-label">User</label>
          <div className="col-sm-3">
            <input type="text" className="form-control" ref={userElement => (this.userElement = userElement)}/>
          </div>
        </div>
        <div className="form-group row justify-content-center">
          <label className="col-sm-1 col-form-label">Password</label>
          <div className="col-sm-3">
            <input type="password" className="form-control" ref={passwordElement => (this.passwordElement = passwordElement)}/>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-sm-3">
            <button type="submit" className="btn btn-primary" onClick={(event) => {
              let userName = this.userElement.value;
              let password = this.passwordElement.value;
              event.preventDefault();
              this.props.loginHandler(userName, password, this.props.history);
            }}>{this.props.loginText ? this.props.loginText : 'Sign Up'}</button>
          </div>
        </div>
      </form>
    );
  }
}

class Status extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isEditable: false
    }

    this.getStatus = this.getStatus.bind(this);
    this.getEditableStatus = this.getEditableStatus.bind(this);
    this.toggleState = this.toggleState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleChange (event) {
    this.props.editStatusHandler(this.props.index, event.target.name, event.target.value);
  }

  handleDelete (event) {
    this.props.deleteStatusHandler(this.props.index);
  }

  toggleState () {
    let isEditable = this.state.isEditable;
    isEditable = !isEditable;
    this.setState({isEditable});
  }

  getEditableStatus() {
    return (
      <tr>
        <td><input className="form-control" name="yesterday" value={this.props.status.yesterday} onChange={this.handleChange}/></td>
        <td><input className="form-control" name="today" value={this.props.status.today} onChange={this.handleChange}/></td>
        <td><input className="form-control" name="dependency" value={this.props.status.dependency} onChange={this.handleChange}/></td>
        <td><button className="btn btn-outline-success btn-sm" onClick={this.toggleState}>Update</button></td>
      </tr>
    );
  }

  getStatus() {
    return (
      <tr>
        <td>{this.props.status.yesterday}</td>
        <td>{this.props.status.today}</td>
        <td>{this.props.status.dependency}</td>
        <td>
          <button className="btn btn-outline-secondary btn-sm" onClick={this.toggleState}>Edit</button>
          <button className="btn btn-outline-danger btn-sm" onClick={this.handleDelete}>Delete</button>
        </td>
      </tr>
    );
  }

  render () {
    return !this.state.isEditable ? this.getStatus() : this.getEditableStatus();
  }
}

class HomePageComponent extends React.Component {
  constructor (props) {
    super(props);

    this.getSprintStatus = this.getSprintStatus.bind(this);
  }

  getSprintStatus () {
    return (
      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>What I did yesterday</th>
            <th>What I will do today</th>
            <th>Dependency</th>
            <th>Operation <button className="btn btn-outline-success btn-sm" onClick={this.props.addStatusHandler}>Add</button></th>
          </tr>
        </thead>
        <tbody>
          {this.props.currentUser.sprintStatus.map((status,index) => (
              <Status 
                key={index} 
                index={index} 
                status={status} 
                editStatusHandler={this.props.editStatusHandler}
                deleteStatusHandler={this.props.deleteStatusHandler}/>
          ))}
        </tbody>
      </table>
    );
  }

  render () {
    const noUserLoggedIn = <h1>Please login to continue...</h1>;

    return !this.props.currentUser ? noUserLoggedIn : this.getSprintStatus();
  }
}

class RouterComponent extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      users: [],
      currentUser: null,
      currentUserIndex: -1
    };

    this.addUser = this.addUser.bind(this);
    this.login = this.login.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.deleteStatus = this.deleteStatus.bind(this);
    this.addStatus = this.addStatus.bind(this);

    this.renderSignUpComponent = this.renderSignUpComponent.bind(this);
    this.renderLoginComponent = this.renderLoginComponent.bind(this);
    this.renderHomePageComponent = this.renderHomePageComponent.bind(this);
  }

  addStatus() {
    let currentUserIndex = this.state.currentUserIndex;
    let currentUser = this.state.currentUser;
    let users = this.state.users;

    currentUser.sprintStatus.push({yesterday: 'yesterday', today: 'today', dependency: 'dependency'});
    users[currentUserIndex] = currentUser;

    this.setState({ users, currentUser });
  }

  deleteStatus(statusIndex) {
    let currentUserIndex = this.state.currentUserIndex;
    let currentUser = this.state.currentUser;
    let users = this.state.users;

    currentUser.sprintStatus.splice(statusIndex, 1);
    users[currentUserIndex] = currentUser;

    this.setState({ users, currentUser });
  }

  updateStatus(statusIndex, fieldName, fieldValue) {
    let currentUserIndex = this.state.currentUserIndex;
    let currentUser = this.state.currentUser;
    let users = this.state.users;
    currentUser.sprintStatus[statusIndex][fieldName] = fieldValue;
    users[currentUserIndex] = currentUser;

    this.setState({ users, currentUser });
  }

  handleLogout(event) {
    let currentUser = this.state.currentUser;
    currentUser = null;
    this.setState({currentUser});
    event.preventDefault();
  }

  login (userName, password, history) {
    for(let i in this.state.users) {
      let user = this.state.users[i];
      if(user.userName === userName && user.password === password) {
        let currentUser = this.state.currentUser;
        currentUser = user;
        let currentUserIndex = this.state.currentUserIndex;
        currentUserIndex = i;
        this.setState({currentUser, currentUserIndex});
        history.push("/");
      }
    }
  }

  addUser(userName, password, history) {
    let currentUser = {userName, password, sprintStatus: [
      {yesterday: 'yesterday', today: 'today', dependency: 'dependency'}
    ]};
    let users = this.state.users
    let currentUserIndex = this.state.currentUserIndex;
    this.state.users.push(currentUser);
    currentUserIndex = this.state.users.length - 1;
    this.setState({ users, currentUser, currentUserIndex });
    history.push('/');
  }

  renderSignUpComponent (props) {
    return <SignUpComponent loginHandler={this.addUser} history={props.history}/>
  }

  renderLoginComponent (props) {
    return <SignUpComponent loginHandler={this.login} history={props.history} loginText='login'/>
  }

  renderHomePageComponent (props) {
    return <HomePageComponent 
      currentUserIndex={this.state.currentUserIndex} 
      currentUser={this.state.currentUser} 
      editStatusHandler={this.updateStatus}
      deleteStatusHandler={this.deleteStatus}
      addStatusHandler={this.addStatus}/>
  }

  render () {
    let userDetails = null;
    if(!this.state.currentUser) {
      userDetails = (
        <div>
          <NavLink exact activeClassName="active" to="/login">Log In</NavLink>|
          <NavLink exact activeClassName="active" to="/signup">Sign Up</NavLink>
        </div>
      );
    } else {
      userDetails = (
        <div>
          <NavLink exact activeClassName="active" to="/">Welcome {this.state.currentUser.userName}</NavLink>|
          <a href="/" onClick={this.handleLogout}>Logout</a>
        </div>
      );
    }

    return (
      <Router>
          <div>
            <section>
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <h1 className="navbar-brand">Yash Spring Management System</h1>

              <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                {userDetails}
              </div>
            </nav>
            </section>
            <section>
              <Route exact path="/" render={this.renderHomePageComponent}/>
              <Route exact path="/signup" render={this.renderSignUpComponent}/>
              <Route exact path="/login" render={this.renderLoginComponent}/>
            </section>
          </div>
        </Router>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <RouterComponent/>
    );
  }
}

export default App;