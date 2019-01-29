import React from "react"

const UpcomingDetails = ({ personName, birthday }) => {
  let month = birthday[5] + birthday[6]
  let day = birthday[8] + birthday[9]
  return <p>{personName} - <br></br>{month}/{day}</p>
}

export default UpcomingDetails
