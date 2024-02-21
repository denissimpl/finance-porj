

class User {
    constructor (name, password) {
        this._name = name
        this._password = password
    }

}

const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json(); 
}

login.onclick = function () {
    modal_login.style.display = "flex"
}

register.onclick = function () {
    modal_register.style.display = "flex"
}

login_btn.onclick = async function () {
    let loginfo = {
        name: login_name.value,
        password: login_password.value
    }
    await postData("http://localhost:4444",loginfo).then((data) => {
        console.log(data); 
      });
}

reg_btn.onclick = function () {
    console.log('1');
    let reginfo = {
        name: register_name.value,
        password: register_password.value
    }
    console.log(reginfo)
}

document.addEventListener("click", (e) => {
    if (e.target.id === "modal_login" || e.target.id === "modal_register") {
        e.target.style.display = "none"
    }
})