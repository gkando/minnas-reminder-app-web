import React, { useState, useEffect } from 'react';
import './App.css';
import chrono from 'chrono-node';
// var chrono = require('chrono-node');

function App() {
  // const data = chrono.parseDate('An appointment on Sep 12-13');
  // console.log(data, typeof(data))
  // console.log(JSON.stringify(data))

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    console.log(tasks)
    console.log(tasks.length)
  }, [tasks]);

  const handleSubmit = () => {
    let str = document.getElementById("task").value;
    let res = chrono.parse(str)[0]
    let task = str.substr(0, res.index).trim();
    let date = res.start.date();
    // console.log(chrono.parseDate(foo).toDateString());
    console.log(res);
    console.log(task, date.toDateString());
    setTasks([ ...tasks, {task: [task], date: date}])
  }
  return (
    <div className="App">
      <div className="task-input">
        <input
          id="task"
          type="text"
          placeholder="e.g. Call Doctor tomorrow at 1pm"
          // onChange={(text) => onInputChange(input.name, text)}
          />
        <button className="input-button" type="button" onClick={handleSubmit}>✓</button>
        <button className="input-button btn-clear" type="button" onClick="alert('Hello World!')">✗</button>
      </div>

      <div ClassName="task-list">
        {tasks.length === 0 ? '':
        tasks.map(task =>  {
          console.log(task)
          return (
            <div className="task-item">
              <div className="item">{task.task}</div>
              <div className="item">{task.date.toDateString()}</div>
            </div>
          )})}
          </div>
    </div>
  );
}

export default App;
