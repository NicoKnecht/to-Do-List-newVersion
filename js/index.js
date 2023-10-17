//VARIABLES
const taskInput = document.querySelector('#taskInput');
const taskButton = document.querySelector('#taskBtn');
const tasksContainer = document.querySelector('.peddingTasks');//ul
const deleteAllBtn = document.querySelector('.btnDeleteAll');
const inputForm = document.querySelector('.tasksCreator');



//FUNCIONES LOCAL STORAGE

/*Me trae las tareas del objeto taskList en el localStorage y me las pasa de json a objeto*/
let taskList = JSON.parse(localStorage.getItem('tasks')) || []; // si no hay nada me trairia nulo , por eso le diogo que me traiga un array vacio
console.log(taskList);

/*almacena cada task en el objeto tasklist en el localstorage pasandolo a json para su guardado*/
const saveTaskList = () => {
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

//FUNCIONES BASE

const template = (task) => {
    const { id, title } = task;// desestructuro

    return `
                        <li class="taskList" >
                            <div class="checkYtextWrapper">
                                <input class="taskCheckbox " id="${id}" type="checkbox">
                                <label class="taskText "  id="label${id}">${title}</label>
                            </div>
                            <div class="buttonWrapper">
                                <button class="btnEdit" ><img src="img/edit-button.png" alt="edit" data-id="${id}"class="imgEdit"></button>
                                <button class="btnDelete" ><img  src="img/delete-button.png" alt="delete" data-id="${id}" class="imgDelete" ></button>
                            </div>
                        <li>
                        `;
    // solucionar vulnerabilidad xss 
}

const renderWithoutTasks = () => {
    let InitialTemplate = `<p class="withoutTasks"> No hay tareas pendientes ¿seguro no te olvidaste de nada? ;D</p> `
    tasksContainer.innerHTML = InitialTemplate;

}
const render = () => {

    if (taskList.length == 0) {
        renderWithoutTasks()
    } else {
        let output = taskList.map(template)
        tasksContainer.innerHTML = output.join("");
        //genera array con templates
        /*El map agarra el array de objetos taskList y le aplica la funcion TEMPLATE 
        es decir, que en cada iteracion mete cada objeto de List dentro del template
        luego se aplica un join('') para que no se visualice la coma entre objeto y objeto(solo por eso)*/

    }
}

//Funcion para validar ingreso del usuario
const isValidTask = (taskname) => {
    if (taskname.length <= 0) {
        alert('No escribiste Nada. Por favor ingresa una tarea')
        return false;
    }
    if (taskList.some((task) => task.title.toLowerCase() === taskname.toLowerCase())) {
        alert('Ya existe una tarea creada con ese nombre')
        return false;
    } else {
        return true;
    }
}


// funcion para esconder el boton de borrar todo si no hay tareas
const toggleDeleteAllButon = () => {
    if (taskList.length === 0) {
        deleteAllBtn.classList.add('btnHidden')
    } else {
        deleteAllBtn.classList.remove('btnHidden')
    }
}



// add, remove, edit
const add = (e) => {
    e.preventDefault();// para que no se actualice la pagina al activar el evento submit
    let taskAdded = taskInput.value.trim();
    if (isValidTask(taskAdded)) {
        taskList = [...taskList, { id: Date.now(), title: taskAdded }];//Ingreso id unico con funcion Date.now y task en el array taskList
        saveTaskList();// como modifique la TaskList y le agregue otro objeto, le digoque vuelva a guardar
        render();

        taskInput.value = "";// borra lo escrito en el imput luego de agregado

        toggleDeleteAllButon();
    }

}
const remove = (e) => {

    if (e.target.className == "imgDelete") {
        let id = e.target.dataset.id;// agarro id del objeto 
        let index = taskList.findIndex(tasks => tasks.id == id); // metodo de iteracion fidIndex busca indice que cumpla la condicion
        if (index !== -1) {// si lo encuentra
            taskList.splice(index, 1); // borramos obj que tenga ese indice


            saveTaskList();
            render();
            toggleDeleteAllButon();
        }

    }
}


const removeAll = (e) => {
    const confirmation = confirm('¿Estás seguro de que quieres borrar la lista?');
    // confirm devuelve true o false
    if (e.target.className == "btnDeleteAll") {
        if (confirmation) {
            while (taskList.length > 0) {
                taskList.pop(); // Elimina el último elemento del array
            }

            saveTaskList();
            render();
            toggleDeleteAllButon();
        }
    }

}


const edit = (e) => {
    if (e.target.className == "imgEdit") {// nos aseguramos que este apretando la imagen edit del boton
        let id = e.target.dataset.id; // agarro el id  
        let inputText = document.getElementById(id); // selecciono el input con el id
        let labelText = document.getElementById("label" + id);

        if (inputText.type == "checkbox") {
            /* desaparesco de pantalla lo escrito en el label
             luego ,al renderizar, el valor del input pasara al label*/

            labelText.style.display = "none";

            inputText.classList.add("taskInputEdit");/* agrego clase que se manifestara  con input text
            NO hace falta sacar la clase. Se elimina cuando se vuelve a renderizar el input ya que esta clase
            no se encuentra en el template original*/

            //cambiar imput
            inputText.type = "text";
            //agarro indice array taskList
            let index = taskList.findIndex(tasks => tasks.id == id);

            inputText.value = taskList[index].title;// paso el valor que ya habia al input para que se visualice

            inputText.addEventListener('blur', function () {
                // Este código se ejecutará cuando el usuario deje de interactuar con el campo de entrada
                taskList[index].title = inputText.value;
                inputText.type = "checkbox";
                saveTaskList();
                render();
            })

        } else {
            render();
        }
    }
}




//FUNCION INICIALIZADORA
/*ACA IRAN LOS ESCUCHADORES DE EVENTOS*/

const init = () => {
    console.log(taskList);
    //Evento para renderizar loque tenga en la lista al cargar la pagina
    document.addEventListener('DOMContentLoaded', render);

    //evento submit ( button) AGREGAR
    // este vale por evento click y keydown PERO en lugar de escuhar elboton, escucho el form
    inputForm.addEventListener('submit', add)
    tasksContainer.addEventListener('click', remove);
    tasksContainer.addEventListener('click', edit);
    deleteAllBtn.addEventListener('click', removeAll);
    document.addEventListener('DOMContentLoaded', toggleDeleteAllButon);
    // para que al cargar no este el boton de borrar todo si no hya tareas al cargar la pagina

}

init();