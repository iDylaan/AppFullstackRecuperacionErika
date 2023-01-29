(() => {
    document.addEventListener('DOMContentLoaded', async () => {
        await getUser();
    })    
    const LINK = new URLSearchParams(window.location.search);
    const ID = LINK.get('id');
    const URL = 'http://localhost:5858/';
    const ROUTE = 'users';

    async function getUser() {
        const user = await axios ({
            method: "GET",
            url: URL + ROUTE + '/' + ID
        })

        fillUser(user.data);
    } 

    function fillUser(user) {
        const {username, email, title, area, password } = user;
        let { state, level } = user;
        state = state[0].toUpperCase() + state.slice(1).toLowerCase();
        level = level[0].toUpperCase() + level.slice(1).toLowerCase();

        user_json = {
            'username': username,
            'email': email,
            'password': password,
            'title': title,
            'area': area,
            'state': state,
            'level': level
        }

        // Selectores
        const inputPass = document.querySelector('#user-form__password');

        const inputName = document.querySelector('#user-form__name');
        const inputEmail = document.querySelector('#user-form__email');
        const inputTitle = document.querySelector('#user-form__title');
        const inputArea = document.querySelector('#user-form__area');
        const inputState = document.querySelector('#user-form__state');
        const inputLevel = document.querySelector('#user-form__level');

        inputName.value = username;
        inputEmail.value = email;
        inputTitle.value = title;
        inputArea.value = area;
        inputState.value = state;
        inputLevel.value = level;
        

        inputName.addEventListener('change', (e) => {
            user_json.username = e.target.value;
        });
        inputEmail.addEventListener('change', (e) => {
            user_json.email = e.target.value;
        });
        inputTitle.addEventListener('change', (e) => {
            user_json.title = e.target.value;
        });
        inputArea.addEventListener('change', (e) => {
            user_json.area = e.target.value;
        });
        inputState.addEventListener('change', (e) => {
            user_json.state = e.target.value;
        });
        inputLevel.addEventListener('change', (e) => {
            user_json.level = e.target.value;
        });
        inputPass.addEventListener('change', (e) => {
            user_json.password = e.target.value;
        })



        const btnEdit = document.querySelector('#btn-register-user');

        btnEdit.addEventListener('click', async function updateUser() {
        
            const response = await axios({
                method: 'PUT',
                url: URL + ROUTE + '/' + ID,
                data: JSON.stringify(user_json),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })

            if (response.statusText !== 'OK') {
                throw new Error({
                    message: 'Error'
                })
            }

            window.location.href = './usuarios.html?status=2';
        });
    }


    
}) ();