import React, { useState, useEffect, useContext, useRef } from 'react';
import './App.css';
import chrono from 'chrono-node';
import { CalContext } from './context/store'
import Events from './components/Events'

function App() {

  const { store, handleClientLoad, handleAuthClick, handleSignoutClick, addEvent } = useContext(CalContext)
  const [tasks, setTasks] = useState([]);
  const inputRef = useRef();
  const timeZone =  Intl.DateTimeFormat().resolvedOptions().timeZone
  // const hoursFromNow = (n) => new Date(Date.now() + n * 1000 * 60 * 60 ).toISOString();

  useEffect(() => {
    handleClientLoad();
   // eslint-disable-next-line react-hooks/exhaustive-deps
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

    let event = {
      summary: [task][0],
      start: {
        dateTime: res.start.date().toISOString(),
        timeZone: timeZone
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: timeZone
      }
    };
    addEvent(event)
    setTasks([ ...tasks, {task: [task], date: date}])
  }

  const handleClear = () => {
    inputRef.current.value = '';
  }

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
          <Events events={store.events} />
        }
          </div>
        {store && 
          <div className="auth">
            <button id="authorize_button"  onClick={store.auth ? handleSignoutClick : handleAuthClick}>
              {store.auth ? 'SignOut' : 'Authorize'}
            </button>
          </div>
        }
    </div>
  );
}

export default App;
