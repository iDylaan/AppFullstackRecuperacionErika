(() => {  // ( async () => {
    // Selectores
    const inputUsers = document.querySelector('#input-users');
    const btnCreateUser = document.querySelector('#btn-register-user');
    const btnsDeleteUser = document.querySelectorAll('.btn-delete-user');

    // Variables
    const URL = 'http://127.0.0.1:5858/';
    let users = []
    let user = {
        username: '',
        email: '',
        password: '',
        title: '',
        area: '',
        state: '',
        level: ''
    }

    document.addEventListener('DOMContentLoaded', () => {
        listarUsuarios();
        eventListeners();
    });

    // Events
    function eventListeners() {
        inputUsers.addEventListener('keyup', validarBusqueda);
        btnCreateUser.addEventListener('click', validarCreateUserForm);
        btnsDeleteUser.forEach(btnDelete => {
            btnDelete.addEventListener('click', () => {
                console.log('eliminando...');
                deleteUser();
            });
        });
    };

    // Eliminar Usuario
    function deleteUser() {
        console.log('Eliminando usuario...');
    }

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
            user.username = inputName ;
            user.email = inputEmail;
            user.password = inputPassword;
            user.title = inputTitle;
            user.area = inputArea ;
            user.state = inputState;
            user.level = inputLevel;
            await agregarUsuario(user);
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
        const usuarios_array = await getUsuarios();

        // Selectores
        const tbodyUser = document.querySelector('#tbody-users');

        if ( usuarios_array ) {
            usuarios_array.forEach(u => {
                user.username = u.username;
                user.email = u.email;
                user.password = u.password;
                user.title = u.title;
                user.area = u.area;
                user.state = u.state;
                user.level = u.level;
                users.push(user);
                userRow = generarRowUser(user);
                tbodyUser.appendChild(userRow);
            });
        } else {
            // TODO: Error 404
            // alert('Se produjo un error 404', usuarios_array);
        }
    };

    function generarRowUser(user) {
        let {username, email, title, area, state, level} = user;
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
                <button type="button" class="btn btn-outline-primary btn-sm btn-rounded">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm btn-rounded btn-delete-user">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        return row;
    }

    // Consultas API con AXIOS

    async function agregarUsuario(data) {
        const ROUTE = 'user';

        try {
            const response = await axios({
                method: 'POST',
                url: URL + ROUTE,
                data: data
            })
            console.log(response);

            if (response.statusText !== 'OK') {
                throw new Error({
                    message: 'Error'
                })
            }
            
        } catch (error) {
            alert(`Ha ocurrido el siguiente error: ${error.message}`);
        }
    }

    async function getUsuarios() {
        const ROUTE = 'users';

        try {
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

})();