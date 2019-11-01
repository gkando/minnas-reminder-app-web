import React, { useState, useEffect, useContext, useRef } from 'react';
import './App.css';
import chrono from 'chrono-node';
import { CalContext } from './context/store'

// var chrono = require('chrono-node');

function App() {

  const { store, handleClientLoad, handleAuthClick, handleSignoutClick, addEvent, deleteEvent } = useContext(CalContext)
  const [tasks, setTasks] = useState([]);
  const inputRef = useRef();
  const timeZone =  Intl.DateTimeFormat().resolvedOptions().timeZone
  
  // getFoo()
  
  useEffect(() => {
    handleClientLoad();
    // console.log(store.auth)
  }, []);

  useEffect(() => {
    console.log(tasks)
  }, [tasks]);

  const handleSubmit = () => {
    let str = document.getElementById("task").value;
    let res = chrono.parse(str)[0]
    let task = str.substr(0, res.index).trim();
    let date = res.start.date();
    let end = res.start.date();
    end.setHours(date.getHours()+1);
    
    // console.log(chrono.parseDate(foo).toDateString());
    console.log(res);
    let event = {
                  summary: [task][0],
                  start:{ 
                    dateTime: res.start.date().toISOString(),
                    timeZone: timeZone
                  },
                  end:{ 
                    dateTime: end.toISOString(),
                    timeZone: timeZone
                  }
                }
    addEvent(event)
    // console.log(event)
    setTasks([ ...tasks, {task: [task], date: date}])
  }

  const handleClear = () => {
    inputRef.current.value = '';
  }

  // style={{display: !state.auth ? 'block' : 'none'}}
  
  return (
    <div className="App">
      <div className="task-input">
        <input
          ref={inputRef}
          id="task"
          type="text"
          placeholder="e.g. Call Doctor tomorrow at 1pm"
          // onChange={(text) => onInputChange(input.name, text)}
          />
        <button className="input-button" type="button" onClick={handleSubmit}>✓</button>
        <button className="input-button btn-clear" type="button" onClick={handleClear}>✗</button>
      </div>

      <div className="task-list">
        {store.events === null ? '':
        store.events.map(task =>  {
          const startTime = new Date(task.start.dateTime).toDateString()
          return (
            <div className="task-item">
              <div className="item">{task.summary}</div>
              <div className="item">{startTime}</div>
              <button className="input-button btn-clear event-btn-delete" type="button" onClick={() => deleteEvent(task.id)}>✗</button>
            </div>
          )})}
        {/* {tasks.length === 0 ? '':
        tasks.map(task =>  {
          console.log(task)
          return (
            <div className="task-item">
              <div className="item">{task.task}</div>
              <div className="item">{task.date.toDateString()}</div>
            </div>
          )})} */}
          </div>
        {store && 
          <div className="auth">
            <button id="authorize_button"  onClick={store.auth ? handleSignoutClick : handleAuthClick}>
              {store.auth ? 'SignOut' : 'Authorize'}
            </button>
          </div>
        }
        <pre id="content" style={{whiteSpace: 'pre-wrap'}}></pre>
    </div>
  );
}

export default App;
