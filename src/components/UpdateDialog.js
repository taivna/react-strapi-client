import axios from 'axios';
import '../App.css';

function UpdateDialog(props) {
    const { handleClose, show, children, sync, task } = props;
    const showHideClassName = show ? "dialog display-block" : "dialog display-none";

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

    async function updateTask(){
        var token = getCookie("jwt");
       
        if(token === ""){
            token = await login();
            setCookie(token);
        }
        
        let taskName = document.getElementById('taskName').value;
        let taskDate = document.getElementById('taskDate').value;

        if(taskName !== '' && taskDate !== ''){
            axios.put(`https://react-strapi-todo.herokuapp.com/tasks/${task.id}`, 
                {
                    name: taskName,
                    datetime: taskDate,
                    done: task.done
                },
                {
                    headers: {
                        Authorization: token
                    }
                }
            )
            .then(() => {
                handleClose();
                sync();
            });
        }
        else
            alert('Task name and/or date field is empty');
    }

  return (
    <div className={showHideClassName}>
      <div className="dialog-main">
        {children}
        <div className="dialog-inputs">
            <input type="text" id="taskName" name="taskName" placeholder="Task name" defaultValue={task.name}></input>
            <input type="datetime-local" id="taskDate" name="taskDate" defaultValue={task.date}></input>
            <button type="button" onClick={handleClose}>
                Cancel
            </button>
            <button type="button" onClick={updateTask}>
                Ok
            </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDialog;