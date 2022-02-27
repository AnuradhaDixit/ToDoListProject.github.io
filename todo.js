let tasks = [];
const tasksList = document.getElementById('list');
const addTaskInput = document.getElementById('add');
const tasksCounter = document.getElementById('tasks-counter');

//main aim is to display the list of 10 todos
function fetchTodos() {
    //   GET request from the given URl
    fetch('https://jsonplaceholder.typicode.com/todos')
    //As fetch is returning a  promise we can use .then on it
    .then(function(response){
       
        //to convert a response object into json call .json
        // here we get all 200 todos and .json will give here again return another promise
        return response.json();
    }).then(function(data){
        tasks = data.slice(0,10); 
        renderList();
    })
    .catch(function(error){
        console.log('error', error);
    })
}

//it will create the li tag adding HTML to li and append it to the list
function addTaskToDOM (task){
  const li = document.createElement('li');

  li.innerHTML= `
  <input type="checkbox"  id="${task.id}" ${task.completed ? 'checked' : ''}
   class="custom-checkbox">
  <label for="${task.id}">${task.title}</label>
  <img src="bin.png" class="delete" data-id="${task.id}" />
`;

tasksList.append(li);
}

//rendering means how we are actually displaying all the items into DOM on the screen
function renderList () {
    //whatever li's are rendered will be initially empty
  tasksList.innerHTML='';

  for(let i=0; i<tasks.length; i++){
    addTaskToDOM(tasks[i]);
  }

  tasksCounter.innerHTML = tasks.length;
}

//we will filter the task toggle the state of task to mark the task as complete
function toggleTask (taskId) {
    const task = tasks.filter(function (task){
        return task.id == Number(taskId)
    });
    
    //if arrays length is greater than zero i.e it is not an empty array
    if(task.length > 0){
        const currentTask = task[0];
        currentTask.completed = !currentTask.completed;
        renderList(); // list when rendered should mark the task as completed or not
        showNotification('Task toggled succcesfully');
        return;
    }

    showNotification('Could not toggle the task')
}

//remove the item from the array which has the task id passed in the function
function deleteTask (taskId) {
    //create a new task array which will return all the task which is not equal to taskId passed in th function delete task
    const newTasks = tasks.filter(function(task){
        return task.id !== Number(taskId)
    })
    //this filter will return the new array
    tasks= newTasks;
    renderList();
    showNotification('Task deleted succesfully')
}

//Here if the task is present then we will push the target
function addTask (task) {
if(task){
    //we will push the task onto the task array
    tasks.push(task);
    renderList();
    showNotification('Task added succesfully!');
    return;
}

showNotification('Task cannot be added!');
}

function showNotification(text) {
    alert(text);
}
//to add the keydown event for the input
function handlleInputKeypress(e){
    if(e.key === 'Enter'){
        //get the text
        const text = e.target.value;
        console.log('text',text)

    if(!text){
        showNotification('Text task cannot be empty');
        return;
    }

    //create a task which have an object 'text' having key as 'title'
    const task = {
        title: text,
        id: Date.now(),
        completed:false
    }
    //we will make the input box empty after adding the task
    e.target.value = '';
    addTask(task);
    }
}

function handleClickListener(e){
 const target = e.target;


 if(target.className == 'delete'){
    const taskId = target.dataset.id;
    deleteTask(taskId);
return;
 }else if(target.className == 'custom-checkbox'){
    const taskId = target.id;
    toggleTask(taskId);
    return;
 }
}

function initialiseApp(){
    fetchTodos();
    addTaskInput.addEventListener('keyup',handlleInputKeypress);
    //we will attach the event Listener to the whole document
    document.addEventListener('click',handleClickListener);    
}

initialiseApp();

