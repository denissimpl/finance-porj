//Инициализация переменных
let userData = {}
let selectedExpenses, selectedIncome;
webSocket = new WebSocket("ws://localhost:5555");



//Функции для фильтрации объектов
function isEqualObjects(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    return true;
}

function removeObjectsFromArray(fullArray, objectsToRemove) {
    return fullArray.filter(item => {
        let found = false;
        for (const obj of objectsToRemove) {
            if (isEqualObjects(item, obj)) {
                found = true;
                break;
            }
        }
        if (found) {
            objectsToRemove = objectsToRemove.filter(obj => !isEqualObjects(item, obj));
            return false;
        }
        return true;
    });
}


//Функция для таблиц
function setTables (userData) {
    let expensesTable = new Tabulator("#expenses__list", {
        selectableRows:true,
        height:"100%", 
        data: userData.expenses || null, 
        layout:"fitColumns", 
        columns:[ 
            {title:"name", field:"name"},
            {title:"amount", field:"amount"},
        ],
    });

    let incomeTable = new Tabulator("#income__list", {
        selectableRows:true,
        height:"100%", 
        data: userData.income || null, 
        layout:"fitColumns", 
        columns:[ 
            {title:"name", field:"name"},
            {title:"amount", field:"amount"},
        ],
    });
    //обработчик кликов по ряду для удаления
    expensesTable.on("rowClick", function(e, row){ 
        selectedExpenses = expensesTable.getSelectedData();
    });
    incomeTable.on("rowClick", function(e, row){ 
        selectedIncome = incomeTable.getSelectedData(); 
    });
}

//отправка запросов по вебсокету
async function dispatchUserActions (webSocket, type, data) {
    webSocket.send(JSON.stringify({
        login: localStorage.getItem("userLogin"),
        password: localStorage.getItem("userPassword"),
        type: type,
        data: data,
    }))
}

//обработка кнопок добавить/удалить
async function updateActions(e) {
    if (e.target.classList.contains("income")) {
        if (e.target.innerText === "Добавить") {
            let data = {
                "name": income__type.value,
                "amount": income__amount.value,
            }
            if (userData.income) {
                userData.income = [...userData.income, data];
            } else {
                userData.income = [data]
            }
            await dispatchUserActions(webSocket, "PUT", userData)
        } else {
            if (userData.income) {
                userData.income = removeObjectsFromArray(userData.income,selectedIncome);
            }
            await dispatchUserActions(webSocket, "DELETE", userData)
        }
    } 
    if (e.target.classList.contains("expenses")){
        if (e.target.innerText === "Добавить") {
            let data = {
                "name": expenses__type.value,
                "amount": expenses__amount.value,
            }
            if (userData.expenses) {
                userData.expenses = [...userData.expenses, data];
            } else {
                userData.expenses = [data]
            }
            await dispatchUserActions(webSocket, "PUT", userData)
        } else {
            if (userData.expenses){
                userData.expenses = removeObjectsFromArray(userData.expenses,selectedExpenses);
            }            
            await dispatchUserActions(webSocket, "DELETE", userData)
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    
    webSocket.onopen = e => {
        console.log('WS started');
        dispatchUserActions(webSocket, "GET")
    }

    webSocket.onmessage = e => {
        let data = JSON.parse(e.data);
        if (JSON.stringify(data) !== JSON.stringify(userData)) {
            userData = data
            setTables(userData)
        }
    }
    
    document.addEventListener("click", async (e) => {
        updateActions(e)
    })
    
})


