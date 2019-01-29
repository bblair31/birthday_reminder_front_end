import React, { Component } from 'react';
import Sidebar from './Sidebar';
import MonthContainer from './MonthContainer';
import DetailsContainer from './DetailsContainer'

class HomeContainer extends Component {

  state = {
    selectedReminder: null
  }


  sidebarDates = () => {
    if (this.props.user) {
      return this.props.user.reminders.filter(reminder => {
        let birthdate = new Date(reminder.birthday)
        let today = new Date()
        if (birthdate > today && ((birthdate - today) * (1.1574e-8) <= 15)) {
          return reminder
        } else {
          return null
        }
      })
    }
  }

  handleNameClick = (reminder) => {
    this.setState({
      selectedReminder: reminder
    }, () => this.props.passUpSelected(reminder))
  }

  render(){
    console.log(this.sidebarDates())
    return(
      <div className="ui grid">
        <Sidebar sidebarDates={this.sidebarDates()}/>
        {this.state.selectedReminder ?
        <DetailsContainer
          selectedReminder={this.state.selectedReminder}
          selectedState={this.props.selectedState}
          handleFormChange={this.props.handleFormChange}
          handleUpdate={this.props.handleUpdate}
          changeRedirect={this.props.changeRedirect}
          handleDeleteClick={this.props.handleDeleteClick}
          handleCancelClick={this.props.handleCancelClick}
          handleMessageClick={this.props.handleMessageClick}
          showMessage={this.props.showMessage}
          handleMessageSubmit={this.props.handleMessageSubmit}
          handleMessageChange={this.props.handleMessageChange}
      />
         : <MonthContainer handleNameClick={this.handleNameClick}  dates={this.props.user.reminders}/>}
      </div>
    )
  }

}

export default HomeContainer
