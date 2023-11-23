//options
const options = {
  responsive: true,
  aspectRatio: 1.68,
  maintainAspectRatio: true,
  maxBarThickness: 50,
  barPercentage: 1,
  grouped: false,
  scales: {
    x: {
      stacked: false,
      ticks: {
        callback: function (val) {
          // Hide every 2nd tick label

          let value = this.getLabelForValue(val)
          return value.replace(/^(com.)/, '').slice(0, 13)
          // return index % 2 === 0 ? this.getLabelForValue(val) : '';
        },
        maxRotation: 50,
        minRotation: 30,
        grid: { display: false },
        offset: true,
        autoSkip: false
      }
    },
    y: { stacked: false }
  },
  layout: {
    padding: {
      top: 50,
      left: 20,
      right: 20
    }
  },
  plugins: {
    legend: {
      display: false,
      title: {
        text: 'title text',
        color: '#fff',
        display: false
      }
    },
    tooltip: {
      enabled: () => (window.innerWidth > 720 ? true : false),

      position: 'toolTipPositioner',
      callbacks: {
        footer: (context) => {
          const itemOobject = context[context[0].datasetIndex].dataset.data[context[0].dataIndex]
          return [`pid: ${itemOobject.pid}`, `user: ${itemOobject.user}`]
        }
      }
    }
  }
}

export default options
