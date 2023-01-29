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

        console.log();
        fillUser(user.data);
    } 

    function fillUser(user) {
        const {username, email, title, area, password} = user;
        let { state, level } = user;
        state = state[0].toUpperCase() + state.slice(1).toLowerCase();
        level = level[0].toUpperCase() + level.slice(1).toLowerCase();

        // Selectores
        const inputPass = document.querySelector('#user-form__password').value;

        const inputName = document.querySelector('#user-form__name').value = username;
        const inputEmail = document.querySelector('#user-form__email').value = email;
        const inputTitle = document.querySelector('#user-form__title').value = title;
        const inputArea = document.querySelector('#user-form__area').value = area;
        const inputState = document.querySelector('#user-form__state').value = state;
        const inputLevel = document.querySelector('#user-form__level').value = level;

        user = {
            'username': inputName,
            'email': inputEmail,
            'password':  inputPass.length > 0 ? inputPass : password,
            'title':  inputTitle,
            'area': inputArea,
            'state': inputState,
            'level': inputLevel
        }

        const btnEdit = document.querySelector('#btn-register-user');

        btnEdit.addEventListener('click', async function updateUser(user) {
        
            const response = await axios({
                method: 'PUT',
                url: URL + ROUTE + '/' + ID,
                data: JSON.stringify(user)
            })

            console.log(response);


            // window.location.href = './usuarios.html?status=2';
        });
    }


    
}) ();