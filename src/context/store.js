import React, { createContext, useEffect, useReducer } from "react";
import gCalConfig from "./config";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        auth: action.payload
      }
    case "SET_EVENTS":
      return {
        ...state,
        events: action.payload
      }
      case "ADD_EVENT":
      return {
        ...state,
        events: [
          ...state.events,
          action.payload,
        ]
      };
    case "SIGNUP_SUCCESS":
      return{
        ...state
      }
    default:
      return state;
  }
};

export const CalContext = createContext();

  // State Stuff
  const initialState = {  
    cal_name: 'primary',
    gCalConfig,
    auth: false,
    events: [],
    email: null,
    token: null,
    id: null,
    img: null, 
    reg_complete: false
  };

export const Provider = props => {

  const [state, dispatch] = useReducer(reducer, initialState)

  const calId = 'i62k5g6dj6b8el7d1pdogvdtj8@group.calendar.google.com'
  var CLIENT_ID = state.gCalConfig.clientId;
  var API_KEY = state.gCalConfig.apiKey;
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  var SCOPES = "https://www.googleapis.com/auth/calendar";
  // var authorizeButton = '';
  // var signoutButton = '';


  // Actions
  function handleClientLoad() {
    window.gapi.load('client:auth2', initClient);
  }
  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {
    console.log('a')
    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then((res) => {
      console.log('res', res)
      // Listen for sign-in state changes.
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      // // Handle the initial sign-in state.
      updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      // authorizeButton.onclick = handleAuthClick;
      // signoutButton.onclick = handleSignoutClick;
    }).catch(err => {
      console.log(err);
    });
    //  function(error) {
    //   appendPre(JSON.stringify(error, null, 2));
    // });
  }
  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      console.log('true')
      dispatch({ type: "SET_AUTH", payload: true })
      // authorizeButton.style.display = 'none';
      // signoutButton.style.display = 'block';
      listUpcomingEvents();
    } else {
      console.log('false')
      dispatch({ type: "SET_AUTH", payload: false })
      // authorizeButton.style.display = 'block';
      // signoutButton.style.display = 'none';
    }
  }
  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick(event) {
    window.gapi.auth2.getAuthInstance().signIn();
  }
  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick(event) {
    window.gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  function listUpcomingEvents() {
    window.gapi.client.calendar.events.list({
      'calendarId': calId,
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(function(response) {
      var events = response.result.items;
      if (events.length > 0) {
        dispatch({ type: "SET_EVENTS", payload:events });        
        // for (let i = 0; i < events.length; i++) {
        //   var event = events[i];
        //   console.log(event)
        //   var when = event.start.dateTime;
        //   if (!when) {
        //     when = event.start.date;
        //   }
        //   appendPre(event.summary + ' (' + when + ')')
        // }
      } else {
        alert('No upcoming events found.');
      }
    });
  }

  function addEvent(event){
    console.log('addEvent:  ', event)
    if (state.auth) {
      console.log("auth");
      return window.gapi.client.calendar.events
        .insert({
          calendarId: calId,
          resource: event
        })
        .then(
          function(response) {
            // Handle the results here (response.result has the parsed body).
            listUpcomingEvents();
            console.log("Response", response);
          },
          function(err) {
            console.error("Execute error", err);
          }
        );
    } else {
      // const e = { start: event.start, summary: event.summary };
      event.id = state.events.length
      dispatch({ type: "ADD_EVENT", payload: event });
      return;
    }
    
  }

  function deleteEvent(id) {
    console.log(id)
    return window.gapi.client.calendar.events.delete({
      "calendarId": calId,
      "eventId": id
    }).then(function(response) {
              // Handle the results here (response.result has the parsed body).
              listUpcomingEvents();
              console.log("Response", response);
            },
            function(err) { console.error("Execute error", err); });
  }

  function updateEvent(event, id) {
    return window.gapi.client.calendar.events.update({
      "calendarId": calId,
      "eventId": id,
      "resource": event
    }).then(function(response) {
      listUpcomingEvents();
      console.log("Response", response);
    },
      function(err) { console.error("Execute error", err); });
  }

  // logging for testing - comment out if not needed
  useEffect(() => {
    console.log('NEW STATE: ', state);
  }, [state]);

  return (
    <CalContext.Provider value={{store: state, handleClientLoad, handleAuthClick, handleSignoutClick, addEvent, deleteEvent, updateEvent}}>
      {props.children}
    </CalContext.Provider>
  );
};