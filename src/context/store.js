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
    events: null,
    email: null,
    token: null,
    id: null,
    img: null, 
    reg_complete: false
  };

export const Provider = props => {

  const [state, dispatch] = useReducer(reducer, initialState)
  // const window.gapi = {
  //   globalPath: 'window.gapi',
  //   url: 'https://apis.google.com/js/api.js'
  // }
  const calId = 'i62k5g6dj6b8el7d1pdogvdtj8@group.calendar.google.com'

  var CLIENT_ID = state.gCalConfig.clientId;
  var API_KEY = state.gCalConfig.apiKey;
  // console.log(CLIENT_ID)
  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/calendar";
  var authorizeButton = '';
  var signoutButton = '';
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
   * Append a pre element to the body containing the given message
   * as its text node. Used to display the results of the API call.
   *
   * @param {string} message Text to be placed in pre element.
   */
  function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
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
      dispatch({ type: "SET_EVENTS", payload:events });
      appendPre('Upcoming events:');
      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          var event = events[i];
          console.log(event)
          var when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          appendPre(event.summary + ' (' + when + ')')
        }
      } else {
        appendPre('No upcoming events found.');
      }
    });
  }

  function addEvent(event){
    console.log('addEvent:  ', event)
      return window.gapi.client.calendar.events.insert({
        "calendarId": calId,
        "resource": event
      })
          .then(function(response) {
                  // Handle the results here (response.result has the parsed body).
                  console.log("Response", response);
                },
                function(err) { console.error("Execute error", err); });
    
  }

  function deleteEvent(id) {
    console.log(id)
    return window.gapi.client.calendar.events.delete({
      "calendarId": calId,
      "eventId": id
    }).then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response", response);
            },
            function(err) { console.error("Execute error", err); });
  }

  function getFoo() {
    // console.log('FOO', CLIENT_ID);
  }

  // function getUser(token) {
  //   const req = `query { me {id, picture, phone, email}}`
  //   axios({
  //       url: 'https://netgiver-stage.herokuapp.com/graphql',
  //       method: 'post',
  //       data: {
  //         query: req
  //       },
  //       headers: {
  //         "x-token": token
  //     },
  //     }).then((result) => {
  //       const data = result.data.data.me; 
  //       console.log("GET_USER:  ", data)
  //         dispatch({ type: "GET_USER_SUCCESS", payload:data });
  //     });
  // };

  // async function addUser(req, img) {
  //   const res = await axios({
  //                 url: 'https://netgiver-stage.herokuapp.com/graphql',
  //                 method: 'post',
  //                 data: { query: req }
  //               })
  //   const data = res.data.data.signUp;
  //   dispatch({ type: "SET_USER", payload: data })
  //   // const imgRes = await uploadImageAsync(img, data.token);
  //   // console.log('IMGRES', imgRes)
  // }

  // logging for testing - comment out if not needed
  useEffect(() => {
    console.log('NEW STATE: ', state);
  }, [state]);

  return (
    <CalContext.Provider value={{store: state, handleClientLoad, handleAuthClick, handleSignoutClick, addEvent, deleteEvent}}>
      {props.children}
    </CalContext.Provider>
  );
};