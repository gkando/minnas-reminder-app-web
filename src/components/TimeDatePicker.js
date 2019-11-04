import React, { useState, useContext, useEffect } from "react";
import dayjs from 'dayjs'

import InputIcon from './InputIcon'
import { makeStyles } from "@material-ui/core/styles";
import { DateTimePicker } from "@material-ui/pickers";
import { IconButton, InputAdornment } from "@material-ui/core";

import { CalContext } from '../context/store'

const useStyles = makeStyles({
  root: {
    // width: '30%'
    minWidth: '50%'
  },
  input: {
    color: "white"
  }
});

const TimeDatePicker = props => {
  const classes = useStyles();
  const { id, summary, date } = props;
  const { updateEvent } = useContext(CalContext);
  const [selectedDate, handleDateChange] = useState(date);


  useEffect(() => {
    handleDateChange(date)
  }, [date]);

  const parseDate = () => {
  if(dayjs().diff(props.date, 'day') < -7){
    return "dddd, MMMM Do, h:mm a";
  }else{
    return "dddd [at] h A";
  }
}


  const handleDateUpdate = (e) => {
    let event = {
      summary: summary,
      start:{ 
        dateTime: e.format()
      },
      end:{ 
        dateTime: e.add(1, 'hour').format()
      }
    }
    updateEvent(event, id);

  }
  return (
      <DateTimePicker
        value={selectedDate}
        format={parseDate(props.date)}
        onChange={handleDateChange}
        onAccept={handleDateUpdate}
        className={classes.root}
        InputProps={{
          classes: {
            input: classes.input
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <InputIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        />
  )
}

export default TimeDatePicker;
