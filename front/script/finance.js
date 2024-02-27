function removeObjectsFromArray(fullArray, objectsToRemove) {
    return fullArray.filter(item => !objectsToRemove.some(obj => isEqualObjects(item, obj)));
}
  
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


webSocket = new WebSocket("ws://localhost:5555");
const currentAcc = {
    login: localStorage.getItem("userLogin"),
    password: localStorage.getItem("userPassword"),
    logged: localStorage.getItem("userLogged")
}
let userData = {}

async function indexSession () {
    console.log('Начало проверки текущей сессии');
    const authStatus = await checkSavedSession()
    if (authStatus) {
        console.log('Имеется активная сессия');
        main__guest.style.display = "none"
        main__auth.style.display = "flex" 
    } else {
        main__guest.style.display = "flex"
        main__auth.style.display = "none"
        console.log('Активной сессии нет');
    }
    
}

let selectedExpenses, selectedIncome;

function setTables (userData) {
    let expensesTable = new Tabulator("#expenses__list", {
        selectableRows:true,
        height:"100%", 
        data: userData.expenses, 
        layout:"fitColumns", 
        columns:[ 
            {title:"name", field:"name"},
            {title:"amount", field:"amount"},
        ],
    });

    let incomeTable = new Tabulator("#income__list", {
        selectableRows:true,
        height:"100%", 
        data: userData.income, 
        layout:"fitColumns", 
        columns:[ 
            {title:"name", field:"name"},
            {title:"amount", field:"amount"},
        ],
    });
    
    expensesTable.on("rowClick", function(e, row){ 
        selectedExpenses = expensesTable.getSelectedData();
    });
    incomeTable.on("rowClick", function(e, row){ 
        selectedIncome = incomeTable.getSelectedData(); 
    });
}


function checker () {
    setTimeout(async () => {
        
        const acc = {
            login: localStorage.getItem("userLogin"),
            password: localStorage.getItem("userPassword"),
            logged: localStorage.getItem("userLogged")
        }
        if (acc.logged !== currentAcc.logged){
            currentAcc.login = acc.login
            currentAcc.password = acc.password
            currentAcc.logged = acc.logged
            await callbackLoader(indexSession)()
        }
        checker()
    }, 1000);
}

async function dispatchUserActions (webSocket, type, data) {
    webSocket.send(JSON.stringify({
        login: localStorage.getItem("userLogin"),
        password: localStorage.getItem("userPassword"),
        type: type,
        data: data,
    }))
}

async function updateActions(e) {
    if (e.target.classList.contains("income")) {
        if (e.target.innerText === "Добавить") {
            let data = {
                "name": income__type.value,
                "amount": income__amount.value,
            }
            userData.income = [...userData.income, data];
            await dispatchUserActions(webSocket, "UPDATE", userData)
        } else {
            userData.income = removeObjectsFromArray(userData.income,selectedIncome);
            await dispatchUserActions(webSocket, "UPDATE", userData)
        }
    } 
    if (e.target.classList.contains("expenses")){
        if (e.target.innerText === "Добавить") {
            let data = {
                "name": expenses__type.value,
                "amount": expenses__amount.value,
            }
            userData.expenses = [...userData.expenses, data];
            await dispatchUserActions(webSocket, "UPDATE", userData)
        } else {
            userData.expenses = removeObjectsFromArray(userData.expenses,selectedExpenses);
            await dispatchUserActions(webSocket, "UPDATE", userData)
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    callbackLoader(indexSession)()
    checker()
    
    webSocket.onopen = e => {
        console.log('WS started');
        dispatchUserActions(webSocket, "GET")
    }

    webSocket.onmessage = e => {
        userData = JSON.parse(e.data);
        callbackLoader(setTables)(userData)
    }

    document.addEventListener("click", async (e) => {
        callbackLoader(updateActions)(e)
    })
    
})


