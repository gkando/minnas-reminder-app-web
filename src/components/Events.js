import React, { useContext } from 'react'
import { CalContext } from '../context/store'
import TimeDatePicker from './TimeDatePicker'

const Events = props => {
  const { deleteEvent } = useContext(CalContext)

  const renderTableHeader = () => {
    let header = ['Task', 'Date', 'Date', 'Delete']
    // let header = Object.keys(students[0]);
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>;
    });
  }

  const renderTableData = () => {
    return props.events.map(task =>  {
      const startTime = new Date(task.start.dateTime).toDateString()
      return (
        <tr key={task.id}>
          <td>{task.summary}</td>
          <td>{startTime}</td>
          <td>
            <TimeDatePicker
              date={new Date(task.start.dateTime)}
              id={task.id}
              summary={task.summary}
            />
          </td>
          <td>
            <button className="input-button btn-clear event-btn-delete" type="button" onClick={() => deleteEvent(task.id)}>✗</button>
          </td>
        </tr>
  )})}

  return (
      <table id="students">
        <tbody>
          <tr>{renderTableHeader()}</tr>
          {renderTableData()}
        </tbody>
      </table>
  )
}

export default Events
