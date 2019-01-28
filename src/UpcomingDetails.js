import React from "react"

const UpcomingDetails = ({ personName, birthday }) => {
  let birthdate = new Date(birthday)
  let day = birthdate.getDay()
  let month = birthdate.getMonth()
  return <p>{personName} - <br></br>{month}/{day}</p>
}

export default UpcomingDetails
