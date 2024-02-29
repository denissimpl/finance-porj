async function getData(urlpath="/charts"){
    const data = {
        login: localStorage.getItem("userLogin"),
        password: localStorage.getItem("userPassword")
    }

    try {
        request = fetch(`http://localhost:4444${urlpath}`,{
            method:"POST",
            body:JSON.stringify(data)
        })
        const response = request.then(res => res.json())
        return response
    } catch (e) {
        console.log("Ошибка при отправке запроса на бек" + e)
    }    
}


function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber);
    return date.toLocaleString('ru-Ru', { month: 'long' });
}


let expMonObj = {}
let incMonObj = {}
let expMonArr = new Array()


async function sumData() {
    let date = new Date()
    let currentMon = date.getMonth()
    let data = await getData()
    let expenses = Array.from(data.expenses)
    let income = Array.from(data.income)
    for (obj of income) {
        let ymd = obj.date.split("-")
        if (incMonObj[new Date(ymd[0]+"-"+ymd[1]+"-01")] ) {
            incMonObj[new Date(ymd[0]+"-"+ymd[1]+"-01")] += Number(obj.amount)
        }
        incMonObj[new Date(ymd[0]+"-"+ymd[1]+"-01")] = Number(obj.amount)
    }
    
    
    for (obj of expenses) {
        buyDate = new Date(Date.parse(obj.date)).getMonth()
        if (buyDate == currentMon){
            if (expMonObj[obj.name.toLowerCase()]) {
                expMonObj[obj.name.toLowerCase()] += Number(obj.amount)
            }
            expMonObj[obj.name.toLowerCase()] = Number(obj.amount)
        }
    }


    for (prop in expMonObj) {
        expMonArr.push({
            value: expMonObj[prop],
            name: prop.charAt(0).toUpperCase()
            + prop.slice(1)
        })
    }
}

function createChartExp() {
    let month = new Date().toLocaleString('default', {month: 'long'})
    let chart = echarts.init(document.getElementById("chart1"))
    
    option = {
        title: {
          text: 'Расходы',
          subtext: month,
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Расходы',
            type: 'pie',
            radius: '60%',
            
            data: expMonArr,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
    chart.setOption(option);
}



function createChartInc() {
    let monthsValues = []
    for (prop in incMonObj){
        let date = new Date(prop)
        monthsValues.push({date :date.getMonth(), amount : incMonObj[prop]})
    }
    monthsValues.sort((a,b) => {
        return Number(a.date) - Number(b.date)
    })

    let chartMonths = []
    let chartAmounts = []
    for (obj of monthsValues) {
        chartMonths.push(getMonthName(obj.date))
        chartAmounts.push(obj.amount)
    }
    
    let chart = echarts.init(document.getElementById("chart2"));
    
    option = {
        xAxis: {
          type: 'category',
          data: chartMonths
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: chartAmounts,
            type: 'line',
            smooth: true
          }
        ]
      };
    chart.setOption(option);
}


document.addEventListener("DOMContentLoaded",async () => {
    await sumData()
    createChartExp()
    createChartInc()
})
