var chartSpending = echarts.init(document.getElementById('charts__spending'));
var chartIncome = echarts.init(document.getElementById('charts__income'));

var spending = {
  title: {
    text: 'Траты'
  },
  tooltip: {},
  legend: {
    data: ['sales']
  },
  xAxis: {
    data: ['Shirts', 'Cardigans', 'Chiffons', 'Pants', 'Heels', 'Socks']
  },
  yAxis: {},
  series: [
    {
      name: 'sales',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
};

var income = {
    title: {
      text: 'Заработок'
    },
    tooltip: {},
    legend: {
      data: ['sales']
    },
    xAxis: {
      data: ['Shirts', 'Cardigans', 'Chiffons', 'Pants', 'Heels', 'Socks']
    },
    yAxis: {},
    series: [
      {
        name: 'sales',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
};

chartSpending.setOption(spending);
chartIncome.setOption(income);