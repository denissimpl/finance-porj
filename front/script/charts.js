async function getData(urlpath="/charts"){
    const data = {
        login: localStorage.getItem("userLogin"),
        password: localStorage.getItem("userPassword")
    }
    try {
        console.log('Это post запрос');
        request = fetch(`http://localhost:4444${urlpath}`,{
            method:"POST",
            body:JSON.stringify(data)
        })
        const response = request.then(res => res.json())
        console.log('Успешный запрос');
        return response
    } catch (e) {
        console.log("Ошибка при отправке запроса на бек" + e)
    }
    
}

async function handleData() {
    let data = await getData()
    console.log(data)
}

document.addEventListener("DOMContentLoaded", () => {
    handleData()
})