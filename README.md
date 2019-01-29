
# BirthdayReminder 🎉 🎂

Efficient, lightweight Single Page Application(SPA) to automate birthday reminders for users’ contacts. Users can utilize an interactive calendar to keep track of all of their connections' birthdays along with notes, relationships and phone numbers. Users can also send SMS text messages with birthday messages and a gif attached via Twilio API.

User Stories:
 - A user signs in and is brought to their account.
 - A user can view each month.
 - A user can add, edit, delete a birthday.
 - A user can receive notifications for birthdays via text. *In progress*
 - A user can send birthday text messages via Twilio


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

**You will need to fork and locally clone the Ruby on Rails backend from this repository:** [BirthdayReminder Backend](https://github.com/bblair31/birthday_reminder_backend)

After following the README in the Backend Repo above, make sure to run `rails s` first so that Rails is running on localhost:3000


### Installing

1. Fork and clone this repository

2. Install all required packages from Node Package Manager
 
```
npm install
```

3. Start up the development server 

```
npm start
```

4. React should alert you to the fact that the Rails server is already running on default port localhost:3000. It will ask if you want to use a different port. Respond with `Y`

React should automatically open the application in your default browser and begin to load. If it does not, you will see the Local web address in terminal at which you can access the application via you browser


## Built With

* [React.js](https://reactjs.org/docs/getting-started.html) - The Javascript framework used
* [Semantic UI](https://semantic-ui.com/) - Integration for user interface and styling components
* [Create React App](https://github.com/facebook/create-react-app) - Bootstrap base application
* [Twilio API](https://www.twilio.com/docs/sms) - External API for sending SMS messages on behalf of users
* [data-fns](https://date-fns.org/docs/Getting-Started) - Modern JavaScript date utility library

## Contributors

* [Shelby Scalia](https://github.com/srscalia)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* https://blog.flowandform.agency/create-a-custom-calendar-in-react-3df1bfd0b728

