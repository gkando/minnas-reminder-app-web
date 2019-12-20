import React, { useState, useEffect, useContext, useRef } from "react";
import Button from "@material-ui/core/Button";
import "./App.css";
import chrono from "chrono-node";
import { CalContext } from "./context/store";
import Events from "./components/Events";
const dayjs = require("dayjs");
const calendar = require("dayjs/plugin/calendar");
dayjs.extend(calendar);

function App() {
  const {
    store,
    handleClientLoad,
    handleAuthClick,
    handleSignoutClick,
    addEvent
  } = useContext(CalContext);
  const [tasks, setTasks] = useState([]);
  const [implied, setImplied] = useState();

  const inputRef = useRef();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // const hoursFromNow = (n) => new Date(Date.now() + n * 1000 * 60 * 60 ).toISOString();

  useEffect(() => {
    handleClientLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   console.log(tasks);
  // }, [tasks]);
  // console.log('FOO', chrono.parse("next monday")[0].start.date());
  // console.log('BAR', chrono.parse("foo bar").length );
  // console.log('BAT', chrono.parse("next monday").length);

  const handleSubmit = () => {
    let str = document.getElementById("task").value;

    let res = chrono.parse(str)[0];
    let task = str.substr(0, res.index).trim();
    let date = res.start.date();
    let end = res.start.date();
    end.setHours(date.getHours() + 1);

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
    addEvent(event);
    setTasks([...tasks, { task: [task], date: date }]);
  };
  const onInputChange = e => {
    let guess = chrono.parse(e.target.value);
    if (guess.length > 0) {
      console.log("input", dayjs(guess[0].start.date()).format("MMM DD"));
      //dayjs(guess[0].start.date()).format('YYYY-MM-DD')
      setImplied(dayjs(guess[0].start.date()).format("MMM DD"));
    } else {
      console.log("FALSE", e.target.value);
    }
  };
  const handleClear = () => {
    inputRef.current.value = "";
  };

  return (
    <div className="App">
      <div className="task-input">
        <input
          ref={inputRef}
          id="task"
          type="text"
          placeholder="e.g. Call Doctor tomorrow at 1pm"
          onChange={onInputChange}
          // onChange={(text) => onInputChange(input.name, text)}
        />
        <button className="input-button" type="button" onClick={handleSubmit}>
          ✓
        </button>
        <button
          className="input-button btn-clear"
          type="button"
          onClick={handleClear}
        >
          ✗
        </button>
      </div>
      {implied && (
        <Button variant="outlined" size="small" color="primary">
          {implied}
        </Button>
      )}
      <div className="task-list">
        {store.events === null ? "" : <Events events={store.events} />}
      </div>
      {store && (
        <div className="auth">
          <button
            id="authorize_button"
            onClick={store.auth ? handleSignoutClick : handleAuthClick}
          >
            {store.auth ? "SignOut" : "Authorize"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
