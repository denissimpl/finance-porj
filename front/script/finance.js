let userData = {}
let selectedExpenses, selectedIncome;
webSocket = new WebSocket("ws://localhost:5555");



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


function setTables (userData) {
    let expensesTable = new Tabulator("#expenses__list", {
        selectableRows:true,
        height:"100%", 
        data: userData.expenses || null, 
        layout:"fitColumns", 
        columns:[ 
            {title:"name", field:"name"},
            {title:"amount", field:"amount"},
            {title:"date", field: "date"}
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
            {title:"date", field: "date"}
        ],
    });

    expensesTable.on("rowClick", function(e, row){ 
        selectedExpenses = expensesTable.getSelectedData();
    });

    incomeTable.on("rowClick", function(e, row){ 
        selectedIncome = incomeTable.getSelectedData(); 
    });
}

async function dispatchUserActions (webSocket, type, data) {
    webSocket.send(JSON.stringify({
        login: localStorage.getItem("userLogin"),
        password: localStorage.getItem("userPassword"),
        type: type,
        data: data,
    }))
}

function clearButtons () {
    expenses__type.value = ""
    expenses__amount.value = ""
    expenses__date.value = ""
    income__type.value = ""
    income__amount.value = ""
    income__date.value = ""
}

async function updateActions(e) {
    if (e.target.classList.contains("income")) {
        if (e.target.innerText === "Добавить") {
            let data = {
                "name": income__type.value,
                "amount": income__amount.value,
                "date": income__date.value
            }
            if (userData.income) {
                userData.income = [...userData.income, data];
            } else {
                userData.income = [data]
            }
            if (data.name !== "" && data.amount !== "" && data.date !== "") {
                await dispatchUserActions(webSocket, "PUT", userData)
            }
            clearButtons()
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
                "date": expenses__date.value
            }
            if (userData.expenses) {
                userData.expenses = [...userData.expenses, data];
            } else {
                userData.expenses = [data]
            }
            if (data.name !== "" && data.amount !== "" && data.date !== "") {
                await dispatchUserActions(webSocket, "PUT", userData)
            }
            clearButtons()

        } else {
            if (userData.expenses){
                userData.expenses = removeObjectsFromArray(userData.expenses,selectedExpenses);
            }
            await dispatchUserActions(webSocket, "DELETE", userData)
            clearButtons()
        }
    }
    
}


document.addEventListener("DOMContentLoaded", () => {
    let expLen = 0,incLen = 0;
    webSocket.onopen = e => {
        dispatchUserActions(webSocket, "GET")
    }

    webSocket.onmessage = e => {
        let data = JSON.parse(e.data);
        
        if (Array.from(data.expenses).length !== expLen || Array.from(data.income).length !== incLen) {
            userData = data
            setTables(userData)
            expLen = Array.from(data.expenses).length
            incLen =  Array.from(data.income).length
        }
    }

    document.addEventListener("click", async (e) => {
        updateActions(e)
    })
    
})


