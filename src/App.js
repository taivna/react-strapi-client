import React from 'react';
import Tabs from './components/Tabs';
import Task from './components/Task';
import axios from 'axios';

import './App.css';

class App extends React.Component {
  state = {
    tasks: [],
    error: null,
    dummy: ''
  };

  componentDidMount = async () => {

    function setCookie(token){
      document.cookie = "jwt=Bearer " + token;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');

        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    // Login to get a token
    async function login(){
      return await axios.post('https://react-strapi-todo.herokuapp.com/auth/local', 
      {
          identifier: 'jane@test.com',
          password: '123456'
      })
      .then(response => {
          return response.data.jwt;
      })
      .catch(error => {
          console.log('error is', error);
      });
    }

    var token = getCookie("jwt");
       
    if(token === "" || token === undefined || token === null){
        token = await login();
        setCookie(token);
    }

    // Get the tasks
    try {
      const response = await axios.get('https://react-strapi-todo.herokuapp.com/tasks',
      {
        headers: {
            Authorization: token,
        }
      });
      this.setState({ tasks: response.data });
    } catch (error) {
      this.setState({ error });
    }
  };

  render() {
    const {tasks, error} = this.state;

    // Print errors if any
    if (error) {
      return <div>An error occured: {error.message}</div>;
    }

    return (
      <div className="app">
        <h1>Reminders</h1>
        <Tabs tasks={this.state.tasks} sync={this.componentDidMount}> 
          <div label="Snoozed"> 
            <p>I'm not sure what exactly should be in this tab</p> 
          </div> 
          <div label="Inbox"> 
            {tasks.map((task) => {
              if(task.done === false)
                return (
                  <Task
                    key = {task.id}
                    id = {task.id} 
                    name = {task.name}
                    datetime = {task.datetime}
                    done = {task.done}
                    sync={this.componentDidMount}
                  />
                )
              return undefined;
            })}
          </div> 
          <div label="Done"> 
          {tasks.map((task) => {
              if(task.done === true)
                return (
                  <Task
                    key = {task.id}
                    id = {task.id} 
                    name = {task.name}
                    datetime = {task.datetime}
                    done = {task.done}
                    sync={this.componentDidMount}
                  />
                )
              return undefined;
            })}
          </div> 
        </Tabs> 
      </div>
    );
  }
}

export default App;