Chart.defaults.global.animation.duration = 0

const colors = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)',
]

const ctx = document.getElementById('stats').getContext('2d')
let chartData
let chart

export default function graphGeneration(x, data) {
  const ys = Object.keys(data)

  if (chart) {
    chartData.labels.push(x)
    ys.forEach((y, i) => chartData.datasets[i].data.push(data[y]))
    chart.update()
  } else {
    chartData = {
      labels: [x],
      datasets: ys.map((y, i) => ({
        label: y,
        borderColor: colors[i],
        backgroundColor: colors[i],
        fill: false,
        data: [data[y]],
        yAxisID: `y-axis-${i}`,
      }))
    };

    chart = Chart.Line(ctx, {
      data: chartData,
      options: {
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        title: {
          display: true,
          text: 'Generation statistics'
        },
        scales: {
          yAxes: ys.map((y, i) => ({
            type: 'linear',
            display: true,
            position: 'left',
            id: `y-axis-${i}`,
          })),
        }
      }
    });
  }
}
