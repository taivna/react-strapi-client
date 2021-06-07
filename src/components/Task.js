import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios';
import moment from 'moment';

function Task(props) {
    let {id, name, datetime, done, sync} = props;

    // Formats the task date differently depending on whether date is today
    let date = moment(datetime).format('DD.MM.yyyy');
    let currentDate = moment(new Date()).format('DD.MM.yyyy');
    
    if(date === currentDate) {
        date = moment(datetime).calendar();
    }

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
            // console.log('response is: ', response);
            return response.data.jwt;
        })
        .catch(error => {
            console.log('error is', error);
        });
    }

    // Sets a task done if clicked on the "check" icon
    async function markDone(){
        done = true;
        var token = getCookie("jwt");
       
        if(token === ""){
            token = await login();
            setCookie(token);
        }

        axios.put(`https://react-strapi-todo.herokuapp.com/tasks/${id}`, 
        {
            name: name,
            datetime: datetime,
            done: done
        },
        {
            headers: {
                Authorization: token,
            }
        }
        ).then(() => {
            sync();
        });
    }

    // Deletes a task if clicked on the "trash" icon
    async function deleteTask(){
        var token = getCookie("jwt");
       
        if(token === ""){
            token = await login();
            setCookie(token);
        }

        axios.delete(`https://react-strapi-todo.herokuapp.com/tasks/${id}`, 
        {
            headers: {
                Authorization: token,
            }
        }
        ).then(() => {
            sync();
        });
    } 

    return (
        <div className="task">
            <p>{date}</p>
            <p>{name}</p>
            <i className="fas fa-trash" onClick={deleteTask} ></i>
            <i className="fas fa-check" onClick={markDone} ></i>
        </div>
    )
}

Task.propTypes = {
    name: PropTypes.string.isRequired,
    datetime: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired
}

export default Task

