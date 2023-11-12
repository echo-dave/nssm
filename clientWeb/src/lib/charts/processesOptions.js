//options
const options = {
  responsive: true,
  aspectRatio: 1.59,
  scales: {
    x: {
      ticks: {
        callback: function (val) {
          // Hide every 2nd tick label

          let value = this.getLabelForValue(val)
          return value.replace(/^(com.)/, '').slice(0, 13)
          // return index % 2 === 0 ? this.getLabelForValue(val) : '';
        }
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
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
