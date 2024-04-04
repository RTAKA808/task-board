// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if(!nextId){
        nextId=1;
    }else{
        nextId++
    }
    localStorage.setItem('nextId', JSON.stringify(nextId))
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let taskCard=$('<div>')
    .addClass('card task-card w-75 draggable my-3')
    .attr('data-task-id', task.id)
    let cardTitle=$('<div>').addClass('card-header h4').text(task.title)
    let cardBody=$('<div>').addClass('card-body')
    let cardContent=$('<p>').addClass('card-text').text(task.description)
    let cardDueDate=$('<p>').addClass('card-text').text(task.dueDate)
    let cardDelete=$('<button>')
    .addClass('btn btn-danger delete')
    .text('delete')
    .attr('data-task-id', task.id);
    cardDelete.on('click', handleDeleteTask)

    if(task.dueDate && task.status !=='done'){
    let now=dayjs();
    let taskDueDate= dayjs(task.dueDate, 'DD/MM/YYYY');

    if(now.isSame(taskDueDate,'day')){
    taskCard.addClass('bg-warning text-white')
    }else if (now.isAfter(taskDueDate)){
    taskCard.addClass('bg-danger text-white')
    cardDelete.addClass('border-light')
    }
}

    cardBody.append(cardContent, cardDueDate, cardDelete)
    taskCard.append(cardTitle,cardBody)
    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
if(!taskList) {
    taskList==[]
}
let  todoCard=$('#todo-cards')
let inProgress=$('#in-progress-cards')
let doneCard=$('#done-cards')
todoCard.empty()
inProgress.empty()
doneCard.empty()

for(let i=0; i<taskList.length; i++){
    if(taskList[i].status==='to-do'){
        todoCard.append(createTaskCard(taskList[i]))
    }else if(taskList[i].status==='in-progress'){
        inProgress.append(createTaskCard(taskList[i]))
}else if(taskList[i].status==='done'){
    doneCard.append(createTaskCard(taskList[i]))
}
}



    $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,


    helper: function (event) {
      let original;
      if($(event.target).hasClass('ui-draggable')){
        original= $(event.target);
      }else {
        original= $(event.target).closest('.ui-draggable');
      }
        return original.clone().css({
            width: original.outerWidth(),
    });

    }
})
}

// Todo: create a function to handle adding a new task
function handleAddTask (event){
    event.preventDefault()

    let task={
        id:generateTaskId(),
        title: $('#taskTitle').val(),
        description:$('#taskDescription').val(),
        dueDate:$('#dueDate').val(),
        status:'to-do'

    }
    taskList.push(task)
    localStorage.setItem('tasks',JSON.stringify(taskList));
    renderTaskList();

    $('#taskTitle').val('');
    $('#taskDescription').val('');
    $('#DueDate').val('');
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
event.preventDefault();
let taskId=$(this).attr('data-task-id')
taskList=taskList.filter(task => task.id !==parseInt(taskId))
    localStorage.setItem('tasks', JSON.stringify(taskList))
    renderTaskList()
}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId=ui.draggable[0].dataset.taskId;
    let statusLane=event.target.id

    for( let i=0; i< taskList.length; i++){
        if(taskList[i].id == parseInt(taskId)) {
            taskList[i].status = statusLane;
        }
    }
    localStorage.setItem('tasks',JSON.stringify(taskList));
    renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
renderTaskList();

    $('#taskForm').on('submit', handleAddTask)
    
    $('.lane').droppable({
        accept:".draggable",
        drop:handleDrop
    })
    $('#dueDate').datepicker({
        changeMonth:true,
        changeYear:true
    })

});
