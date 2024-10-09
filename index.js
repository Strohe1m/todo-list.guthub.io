let todoItemAdderNode = document.querySelector('.todo-item-adder')
let todoHolderInner = document.querySelector('.todo-holder-inner')
let menuItemsNode = document.querySelectorAll('.menu-item')
let elemsDeliterNode = document.querySelector('.elems-deliter')
let delElemsOptionsHolderNode = document.querySelector('.del-elems-options-holder')
let hideElemsOptionsHolderNode = document.querySelector('.hide-elems-options-holder')

addEventListenersToElems(menuItemsNode)

let todoObjctsArray = []

checkLocalStorage(todoObjctsArray)

todoItemAdderNode.addEventListener('click', function() {
    showEditWindow()
})

function cerateTodoItemHtml(obj) {
    let newTodo = document.createElement('div')
    newTodo.classList.add('todo-item')
    newTodo.setAttribute('data-todo-num', `${obj.objNumber}`)
    newTodo.innerHTML = `<div class="left-to-do-part todo-part">
                                <span class="task-text">${obj.taskText}</span>
                            </div>
                            <div class="right-to-do-part todo-part">
                                <div class='check-outer' data-check-outer><div class="check" data-check></div></div>
                                <div class="delete" onclick="deleteElem(event)"><img src="icons/delete_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg"
                                        alt=""></div>
                            </div>`
    todoHolderInner.appendChild(newTodo)
}

function deleteElem(event) {
    let deleteNode = event.target
    let parentElem = deleteNode.closest('.todo-item')
    let todoObjIndex = todoObjctsArray.find((item) => item.objNumber == parentElem.getAttribute('data-todo-num'))
    todoObjIndex = todoObjctsArray.indexOf(todoObjIndex)
    todoObjctsArray.splice(todoObjIndex, 1)
    todoHolderInner.removeChild(parentElem)
    addToLocalSotrage()
}

function showEditWindow() {
    let editBack = document.createElement('div')
    editBack.classList.add('edit-window')
    editBack.innerHTML = `<div>
                            <input type='text' class='text-changer'>
                            <button class='ok-btn changer-btn'>Ok</button>
                            <button class='cancel-btn changer-btn'>Cancel</button>
                        </div>`
    document.body.appendChild(editBack)
    document.querySelector('.cancel-btn').addEventListener('click', function() {
        document.body.removeChild(editBack)
    })
    document.querySelector('.ok-btn').addEventListener('click', function() {
        let textOfTask = document.querySelector('.text-changer').value
        let newTodoElemObj = {
            objNumber: Math.random() * 10000,
            taskText: '',
            done: false,
        }
        newTodoElemObj.taskText = textOfTask
        todoObjctsArray.push(newTodoElemObj)
        addToLocalSotrage()
        cerateTodoItemHtml(newTodoElemObj)
        document.body.removeChild(editBack)
    })
}

/* ____________________ succesed tasks _______________________________ */

todoHolderInner.addEventListener('click', function(event) {
    let dataCheck = event.target.hasAttribute('data-check-outer') || event.target.hasAttribute('data-check') 
    if(dataCheck) {
        let potentiuallyDataCheckElem = event.target.hasAttribute('data-check')
        let dataCheckElem = potentiuallyDataCheckElem ? event.target : event.target.querySelector('.check')
        checkNodeBg(dataCheckElem)
    } else if(event.target.tagName.toLowerCase() == 'span') {
        editTodoItem(event.target)
    }
    
})

function checkNodeBg(checkElem) {
    if (checkElem.style.width == '0px' || checkElem.style.width == '') {
        checkElem.style.width = '17px'
        setDoneVal(checkElem, true)
    }
    else {
        checkElem.style.width = '0px'
        setDoneVal(checkElem, false)
    }
}

function setDoneVal(checkElem, boolVal) {
    checkElem = checkElem.closest('.todo-item')
    let todoObjIndex = todoObjctsArray.find((item) => item.objNumber == checkElem.getAttribute('data-todo-num'))
    todoObjIndex.done = boolVal
    addToLocalSotrage()
}

/* _______________ edit the todo item ______________________________ */

function editTodoItem(eventElem) {
    let parenteventElem = eventElem.closest('.todo-item') 
    let todoObj = todoObjctsArray.find((item) => item.objNumber == parenteventElem.getAttribute('data-todo-num'))
    showEditTodoWindow(todoObj, eventElem)

}

function showEditTodoWindow(obj, elemToChange) {
    let editBack = document.createElement('div')
    editBack.classList.add('edit-window')
    editBack.innerHTML = `<div>
                            <input type='text' class='edit-text-changer' placeholder='${obj.taskText}'>
                            <button class='edit-ok-btn changer-btn'>Ok</button>
                            <button class='edit-cancel-btn changer-btn'>Cancel</button>
                        </div>`
    todoHolderInner.appendChild(editBack)
    let editTextChangerNode = editBack.querySelector('.edit-text-changer')
    let editOkBtn = editBack.querySelector('.edit-ok-btn')
    editOkBtn.addEventListener('click', () => {
        let todoObj = saveChanges(editTextChangerNode, obj)
        saveVisibleChanges(elemToChange, todoObj)
        todoHolderInner.removeChild(editBack)
        addToLocalSotrage()
    })
    let cancelBtnNode = editBack.querySelector('.edit-cancel-btn')
    cancelBtnNode.addEventListener('click', () => {
        todoHolderInner.removeChild(editBack)
    })
}

function saveChanges(editInput, objToChange) {
    objToChange.taskText = editInput.value
    return objToChange
}

function saveVisibleChanges(elemToChange, todoObj) {
    elemToChange.innerHTML = todoObj.taskText
}


/* show menu options _______________________________ */

function addEventListenersToElems(items) {
    for (let item of items) {
        item.addEventListener('click', function() {
            closeOpenedOptions(this)
            showOptions(item)
        })
    }   
}

function showOptions(item) {
    let itemChild = item.querySelector('.option-holder')
    let blockHeight = itemChild.style.height
    if (blockHeight === '0px' || blockHeight === '') {
        itemChild.style.height = '78px'
        return;
    }
    itemChild.style.height = '0px'
}

function closeOpenedOptions(that) {
    if (menuItemsNode[0] == that) {
        let secondElemChild = menuItemsNode[1].querySelector('.option-holder')
        secondElemChild.style.height = '0px'
    } else if (menuItemsNode[1] == that) {
        let firstElemChild = menuItemsNode[0].querySelector('.option-holder')
        firstElemChild.style.height = '0px'
    }
}

/* delete items _______________________ */

delElemsOptionsHolderNode.addEventListener('click', function(event) {
    deleteItems(event)
    addToLocalSotrage()
})

function deleteItems(event) {
    let deleteOption = event.target.getAttribute('id')
    switch (deleteOption) {
        case 'del-all': 
            delAll();
            break;
        case 'del-compl':
            delCompl();
            break;
        case 'del-not-compl':
            delNotCompl();
            break;
    }
}

function delAll() {
    todoHolderInner.innerHTML = ''
    todoObjctsArray = []
}

function delCompl() {
    let complTasks = todoObjctsArray.filter((item) => item.done === true)
    for (let task of complTasks) {
        let elemToRemove = todoHolderInner.querySelector(`[data-todo-num='${task.objNumber}']`)
        todoHolderInner.removeChild(elemToRemove)
        let taskIndex = todoObjctsArray.indexOf(task)
        todoObjctsArray.splice(taskIndex, 1)
    }
}

function delNotCompl() {
    let complTasks = todoObjctsArray.filter((item) => item.done === false)
    for (let task of complTasks) {
        let elemToRemove = todoHolderInner.querySelector(`[data-todo-num='${task.objNumber}']`)
        todoHolderInner.removeChild(elemToRemove)
        let taskIndex = todoObjctsArray.indexOf(task)
        todoObjctsArray.splice(taskIndex, 1)
    }
}

/* hide items _______________________ */

hideElemsOptionsHolderNode.addEventListener('click', function(event) {
    hideItems(event)
})

function hideItems(event) {
    let deleteOption = event.target.getAttribute('id')
    switch (deleteOption) {
        case 'hide-all': 
            hideAll();
            break;
        case 'hide-compl':
            hideCompl();
            break;
        case 'hide-not-compl':
            hideNotCompl();
            break;
    }
    
    
}

let hideAllOpportunity = true
function hideAll() {
    let allItems = todoHolderInner.querySelectorAll('.todo-item')
    if (hideAllOpportunity) {
        for (let item of allItems) {
            item.style.display = 'none'
        }
        hideAllOpportunity = false
    } else {
        for (let item of allItems) {
            item.style.display = 'flex'
        }
        hideAllOpportunity = true
    }
    
}

function hideCompl() {
    let complTasks = todoObjctsArray.filter((item) => item.done === true)
    showHideElems(complTasks)
}

function hideNotCompl() {
    let notComplTasks = todoObjctsArray.filter((item) => item.done === false)
    showHideElems(notComplTasks)
}

function showHideElems(arr) {
    for (let task of arr) {
        let elemToHide = todoHolderInner.querySelector(`[data-todo-num='${task.objNumber}']`)
        let flexBoolVar = elemToHide.style.display === ''   
        if (flexBoolVar) elemToHide.style.display = 'none'
        else elemToHide.style.display = ''
    }
}

/* LocalStorage ___________________ */

function addToLocalSotrage(arr) {
    jsonString = JSON.stringify(todoObjctsArray)
    localStorage.setItem('todo-items', jsonString)
}

function checkLocalStorage() {
    let lcsValue = localStorage.getItem('todo-items')
    lcsValue = JSON.parse(lcsValue)

    if (lcsValue == []) 
        return

    for (let item of lcsValue) {
        addJSONobjToArr(item)
        cerateTodoItemHtmlFrmLcs(item)
    }
}

function cerateTodoItemHtmlFrmLcs(obj) {
    let newTodo = document.createElement('div')
    newTodo.classList.add('todo-item')
    newTodo.setAttribute('data-todo-num', `${obj.objNumber}`)
    newTodo.innerHTML = `<div class="left-to-do-part todo-part">
                                <span class="task-text">${obj.taskText}</span>
                            </div>
                            <div class="right-to-do-part todo-part">
                                <div class='check-outer' data-check-outer><div class="check" data-check></div></div>
                                <div class="delete" onclick="deleteElem(event)"><img src="icons/delete_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg"
                                        alt=""></div>
                            </div>`
    checkedCkech(obj, newTodo)
    todoHolderInner.appendChild(newTodo)
}

function checkedCkech(obj, newTodo) {
    if (obj.done === true) {
        let ckeckElem = newTodo.querySelector('.check')
        checkNodeBg(ckeckElem)
    }
}

function addJSONobjToArr(obj) {
    todoObjctsArray.push(obj)
}
