// Функция проверки активной сессии


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




document.addEventListener("DOMContentLoaded", () => {
    function greet() {
        setTimeout(() => {
            greeting.innerHTML = getGreeting()
            greet()
        }, 1000);
    }
    greet()
})





  