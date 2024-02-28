
function authReq(urlpath="", body={}){
    try {
        console.log('Запрос на бек (auth)');
        if (body.length == 0){
            console.log('Это get запрос');
            request = fetch(`http://localhost:4444${urlpath}`)
        } else {
            console.log('Это post запрос');
            request = fetch(`http://localhost:4444${urlpath}`,{
                method:"POST",
                body:JSON.stringify(body)
            })
        }
        const response = request.then(res => res.json())
        console.log('Успешный запрос');
        return response
    } catch (e) {
        console.log("Ошибка при отправке запроса на бек" + e)
    }
    
}

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




function getGreeting() {
    const name = localStorage.getItem("userLogin")
    const currentHour = new Date().getHours();
  
    if (currentHour >= 5 && currentHour < 12) {
        return `Доброе утро, ${name}!`;
    } else if (currentHour >= 12 && currentHour < 18) {
        return `Добрый день, ${name}!`;
    } else if (currentHour >= 18 && currentHour < 24) {
        return `Добрый вечер, ${name}!`;
    } else {
        return `Доброй ночи, ${name}!`;
    }
}

const currentAcc = {
    login: localStorage.getItem("userLogin"),
    password: localStorage.getItem("userPassword"),
    logged: localStorage.getItem("userLogged")
}

function checker () {
    setTimeout(() => {
        
        const acc = {
            login: localStorage.getItem("userLogin"),
            password: localStorage.getItem("userPassword"),
            logged: localStorage.getItem("userLogged")
        }
        if (acc.logged !== currentAcc.logged){
            greeting.innerHTML = getGreeting()
            currentAcc.login = acc.login
            currentAcc.password = acc.password
            currentAcc.logged = acc.logged
            callbackLoader(indexSession)()
        }
        checker()
    }, 1000);
}

function createSession() {
    register.style.display = "none"
    login.style.display = "none"
    exit.style.display = "block"
    const acc = {
        login: localStorage.getItem("userLogin"),
        password: localStorage.getItem("userPassword"),
        logged: localStorage.getItem("userLogged")
     }
    if (acc !== null){
        localStorage.setItem("userLogged", true)
    }
}

function endSession () {
    register.style.display = "block"
    login.style.display = "block"
    exit.style.display = "none"
    const acc = {
        login: localStorage.getItem("userLogin"),
        password: localStorage.getItem("userPassword"),
        logged: localStorage.getItem("userLogged")
     }
    if (acc){
        localStorage.removeItem("userLogin")
        localStorage.removeItem("userPassword")
        localStorage.removeItem("userLogged")
    }
}

// функция проверки текущей сессии
async function checkSavedSession() {
    const acc = {
        login: localStorage.getItem("userLogin"),
        password: localStorage.getItem("userPassword"),
        logged: localStorage.getItem("userLogged")
     }
    
    if (acc){
        if (acc.logged === "true") {
            const loginfo = {
                login: acc.login,
                password: acc.password
            }
            
            let response = await authReq("/login",loginfo)
            console.log(response);
            if (response.status) {
                createSession()
                return true
            }
        }
    }
    return false
}

// нажатие на кнопку войти
login_btn.onclick = callbackLoader(async function () {
    let loginfo = {
        login: login_name.value,
        password: login_password.value
    }
    let response = await authReq("/login",loginfo)
    console.log(response);
    if (response.status) {
        log__info.innerHTML = "Успешно"
        log__info.style.color = "green"
        setTimeout(() => {
            localStorage.setItem("userLogin", response.login)
            localStorage.setItem("userPassword", response.password)
            localStorage.setItem("userLogged", true)
            createSession()
            modal_login.style.display = "none"
        }, 1000);
    } else {
        log__info.innerHTML = response.reason ?? "ошибка"
        log__info.style.color = "red"
    }
})

// нажатие на кнопку зарегистрироваться
reg_btn.onclick = callbackLoader(async function () {
    console.log('Регистрация');
    let reginfo = {
        login: register_name.value,
        password: register_password.value
    }
    let response = await authReq("/register",reginfo)
    console.log(response);
    if (response.status) {
        reg__info.innerHTML = "Успешно"
        reg__info.style.color = "green"
        setTimeout(() => {
            modal_register.style.display = "none"
        }, 1000);
    } else {
        reg__info.innerHTML = response.reason ?? "ошибка"
        reg__info.style.color = "red"
    }
})

// обработка выхода из модалки
document.addEventListener("click", (e) => { 
    if (e.target.id === "modal_login" || e.target.id === "modal_register"  || e.target.classList.value === "modal__cross" 
            || e.target.classList.value === "modal__cross__path") {
                modal_login.style.display = "none"
                modal_register.style.display = "none"
    }
})

exit.onclick = callbackLoader(function () {
    endSession()
})

login.onclick = function () {
    modal_login.style.display = "flex"
}

register.onclick = function () {
    modal_register.style.display = "flex"
}


document.addEventListener("DOMContentLoaded", () => {
    callbackLoader(indexSession)()
    checker()
})