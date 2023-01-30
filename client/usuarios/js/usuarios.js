( () => {  // ( async () => {
    // Selectores
    const inputUsers = document.querySelector('#input-users');
    const btnCreateUser = document.querySelector('#btn-register-user');

    // Variables
    const URL = 'http://localhost:5858/';
    const ROUTE = 'users';
    let users = [];
    let userObj = {
        id: '',
        username: '',
        email: '',
        password: '',
        title: '',
        area: '',
        state: '',
        level: ''
    }


    document.addEventListener('DOMContentLoaded', () => {
        eventListeners();
    });

    // Events
    async function eventListeners() {
        users = await getUsers();
        listarUsuarios();
        inputUsers.addEventListener('keyup', validarBusqueda);
        btnCreateUser.addEventListener('click', validarCreateUserForm);
    };

    // Validacion del formulario para registrar un usuario
    async function validarCreateUserForm(e) {
        e.preventDefault();

        // Selectores
        let inputName = document.querySelector('#user-form__name').value;
        let inputEmail = document.querySelector('#user-form__email').value;
        let inputPassword = document.querySelector('#user-form__password').value;
        let inputTitle = document.querySelector('#user-form__title').value;
        let inputArea = document.querySelector('#user-form__area').value;
        let inputState = document.querySelector('#user-form__state').value;
        let inputLevel = document.querySelector('#user-form__level').value;

        if (
            inputName === '' ||
            inputEmail === '' ||
            inputPassword === '' ||
            inputTitle === '' ||
            inputArea === '' ||
            inputState === '' ||
            inputLevel === ''
        ){ console.log('Todos los campos son obligatorios');} 
        else {
            userObj.username = inputName ;
            userObj.email = inputEmail;
            userObj.password = inputPassword;
            userObj.title = inputTitle;
            userObj.area = inputArea ;
            userObj.state = inputState;
            userObj.level = inputLevel;
            await agregarUsuario(userObj);
        }
    }

    // Validacion del Formulario
    function validarBusqueda(e) {
        let busqueda = document.querySelector('#input-users').value;

        if(busqueda === '') {
            imprimirUsuarios();
        } else {
            console.log(busqueda);
        }
    }

    // Listar Usuarios
    async function listarUsuarios () {
        // Selectores
        const tbodyUser = document.querySelector('#tbody-users');


        users.forEach(user => {
            userRow = generarRowUser(user);
            tbodyUser.appendChild(userRow);
        })


        // Event Listener to delete a user
        btnsDelete = tbodyUser.querySelectorAll('.btn-delete-user');
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', async function deleteUser(e) {
                user_id = e.target.attributes["data-id"]["nodeValue"];
                user_data = await getUser(user_id);
                const confirmar = confirm('¿Deseas eliminar a ' + user_data.username + '?');

                if ( confirmar ) {
                    users = users.filter(user => user.id !== user_id);
                    limpiarHTML();
                    const response = await axios({
                        method: 'DELETE',
                        url: URL + ROUTE + '/' + user_id
                    })
                    await listarUsuarios();
                }
            })
        });
    };

    function generarRowUser(user) {
        let {id, username, email, title, area, state, level} = user;
        state = state[0].toUpperCase() + state.slice(1).toLowerCase();
        level = level[0].toUpperCase() + level.slice(1).toLowerCase();

        // class state
        let classState = null;
        switch (state) {
            case 'Active': classState = 'success'; break;
            case 'Onboarding': classState = 'primary'; break;
            case 'Awaiting': classState = 'warning'; break;
            case 'Inactive': classState = 'danger'; break;
            default: classState = 'secondary'; break;
        };
        
        // creando elementos
        const row = document.createElement('TR');

        row.innerHTML += `
            <td>
                <div class="d-flex align-items-center">
                    <div class="ms-3">
                        <p class="fw-bold mb-1">${username}</p>
                        <p class="text-muted mb-0">${email}</p>
                    </div>
                </div>
            </td>
            <td>
                <p class="fw-normal mb-1">${title}</p>
                <p class="text-muted mb-0">${area}</p>
            </td>
            <td>
                <div class="badge text-bg-${classState}">
                    ${state}
                </div>
            </td>
            <td>${level}</td>
            <td>
                <a href="./user-editForm.html?id=${id}" type="button" class="btn btn-outline-primary btn-sm btn-rounded">
                    <i class="fa-solid fa-pen" data-id="${id}"></i>
                </a>
                <a type="button" class="btn btn-outline-danger btn-sm btn-rounded btn-delete-user" data-id="${id}">
                    <i class="fa-solid fa-trash" data-id="${id}"></i>
                </a>
            </td>
        `;
        return row;
    }

    const limpiarHTML = () => {
        const tbodyUser = document.querySelector('#tbody-users');
        tbodyUser.innerHTML = '';
    }

    // Consumo de API con AXIOS

    async function agregarUsuario(data) {
        try {
            const response = await axios({
                method: 'POST',
                url: URL + ROUTE,
                data: data
            })

            if (response.statusText !== 'OK') {
                throw new Error({
                    message: 'Error'
                })
            }

            console.log(response.data)

            users = [...users, response.data];
            limpiarHTML();
            await listarUsuarios();
        } catch (error) {
            alert(`Ha ocurrido el siguiente error: ${error.message}`);
        }
    }

    async function getUsers() {
        try {
            let usuarios_array = [];
            const response = await axios({
                method: 'GET',
                url: URL + ROUTE
            })

            if (response.statusText !== 'OK') {
                throw new Error({
                    message: 'Error'
                })
            }
            return response.data;
        } catch (error) {
            alert(`Ha ocurrido el siguiente error: ${error.message}`);
        }
    }


    async function getUser(id) {
        const user = await axios({
            method: "GET",
            url: URL + ROUTE + '/' + id
        })

        return user.data;
    } 

})();