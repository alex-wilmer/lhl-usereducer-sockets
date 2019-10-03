import React, { useState, useEffect, useReducer } from 'react';
import './App.css';

// const messages = [
//   {
//     author: "alex",
//     data: "hey hey hey"
//   },
//   {
//     author: "bob",
//     data: "....."
//   },
//   {
//     author: "alex",
//     data: "what's the deal bob?"
//   },
// ]

// let messagesByAuthor = messages.reduce((result, message) => {
//   let messages = result[message.author] || []
//   result[message.author] = [...messages, message.data]
//   return result
// }, {})

const socket = new WebSocket('ws://localhost:8080');

function initialize() {
  return {
    username: 'Alex',
    draftMessage: '',
    messages: [],
  }
}

function reducer (state, action) {
    switch(action.type) {
      case 'SET_USERNAME':
        return {...state, username: action.payload }
      case 'SET_DRAFT_MESSAGE':
        return {...state, draftMessage: action.payload }
      case 'SET_MESSAGES':
        return {...state, messages: action.payload }
      default:
        return state
    }
  
}

function App() {
  let [state, dispatch] = useReducer(reducer, {}, initialize)

  useEffect(() => {
    socket.addEventListener('message', event => {
      let parsedData = JSON.parse(event.data)

      dispatch({ type: 'SET_MESSAGES', payload: parsedData })
    })
  }, [])

  return (
    <div className="App">
      <h1>
        set your name
      </h1>
      <input
        onChange={event => dispatch({
          type: 'SET_USERNAME',
          payload: event.target.value
        })}
        value={state.username}
      />
      <h2>
        what's your message
      </h2>
      <input
        onChange={event => dispatch({ type: 'SET_DRAFT_MESSAGE', payload: event.target.value })}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            // setMessages([...messages, event.target.value])
            dispatch({ type: 'SET_DRAFT_MESSAGE', payload: '' })

            socket.send(JSON.stringify({
              message: event.target.value,
              username: state.username
            }))
          }
        }}
        value={state.draftMessage}
      />

      <ul>
        {state.messages.map(message =>
          <li key={message.date}><b>{message.username}</b> {message.message}</li>)}
      </ul>
    </div>
  );
}

export default App;
