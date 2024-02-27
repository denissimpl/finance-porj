// Функция проверки активной сессии
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



const currentAcc = {
    login: undefined,
    password: undefined,
    logged: undefined
}

function checker () {
    setTimeout(() => {
        
        const acc = {
            login: localStorage.getItem("userLogin"),
            password: localStorage.getItem("userPassword"),
            logged: localStorage.getItem("userLogged")
        }
        if (acc.logged !== currentAcc.logged){
            currentAcc.login = acc.login
            currentAcc.password = acc.password
            currentAcc.logged = acc.logged
            callbackLoader(indexSession)()
        }
        checker()
    }, 1000);
}



document.addEventListener("DOMContentLoaded", () => {
    checker()
    webSocket = new WebSocket("ws://localhost:5555");
    webSocket.onopen = e => {
        webSocket.onmessage = e => console.log(e);
        webSocket.send(JSON.stringify({
            text: "hello",
            number: 3321
        }))
    }
})


