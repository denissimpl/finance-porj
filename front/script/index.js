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
            greeting.innerHTML = getGreeting()
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
})





  