import React, { Component } from "react";
import Welcome from './Welcome';
import HomeContainer from './HomeContainer'

const USERS = 'http://localhost:3000/api/v1/users'
const USERTOKEN = 'http://localhost:3000/api/v1/user_token'
const CURRENTUSER = 'http://localhost:3000/api/v1/users/current'


class App extends Component {

  state = {
    loggedInUser: null,
    users: [],
    emailInput: "",
    passwordInput: ""
  }

  componentDidMount(){
    fetch(USERS)
    .then(r=>r.json())
    .then(json=>{
      this.setState({
        users: json
      })
    })
  }

  authenticateUser = () => {
    console.log(this.state)
    fetch(USERTOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({
        "auth": {"email": this.state.emailInput, "password": this.state.passwordInput}
      })
    })
    .then(res => res.json())
    .then(json => localStorage.setItem("jwt", json.jwt))
    // .then(this.fetchCurrentUser()) put this back in once we fix fetchCurrentUser
  }

  fetchCurrentUser = () => {
    fetch(CURRENTUSER, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.jwt}`,
      }),
      body: JSON.stringify()
    })
    .then(console.log)
    ///// // TODO:  NEED TO FIX THIS SO THAT IT FETCHES THE CURRENT USER AND WE CAN PUT IT IN STATE AS AN OBJECT
  }

  findUser = ()=> {
    return this.state.users.find(user=>{
      return user.id ===this.state.loggedInUser
    })
  }

  handleEmailChange = (event) => {
    this.setState({emailInput : event.target.value})
  }

  handlePasswordChange = (event) => {
    this.setState({passwordInput : event.target.value})
  }

  handleLoginSubmit = (event) => {
    event.preventDefault()
    this.authenticateUser()
  }

  handleLogoutClick = (event) => {
    localStorage.clear()
    this.setState({loggedInUser: {}})
  }




  render() {
    return (
      <div>
        {localStorage.jwt ? <HomeContainer
          user={this.findUser()}
          handleLogoutClick={this.handleLogoutClick}
          /> : <Welcome
          handleEmailChange={this.handleEmailChange}
          handlePasswordChange={this.handlePasswordChange}
          handleLoginSubmit={this.handleLoginSubmit}
        />}
      </div>
    );
  }
}
export default App;
