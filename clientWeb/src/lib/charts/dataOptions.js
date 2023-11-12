const options = {
  responsive: true,
  animations: false,
  aspectRatio: 3.5,
  plugins: {
    legend: {
      align: 'center',
      display: true,
      Title: { diplay: true, color: 'white' },
      labels: {
        color: 'white',
        usePointStyle: true
      }
    }
  },
  scales: {
    x: {
      ticks: {
        // For a category axis, the val is the index so the lookup via getLabelForValue is needed
        callback: function (val) {
          // Hide every 2nd tick label
          // return index % 5 === 0
          //   ?
          return this.getLabelForValue(val).toLocaleString('default', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          })
          // : ''
        },
        color: 'white',
        grid: { display: false },
        display: true,
        maxRotation: 0,
        minRotation: 0,
        align: 'inner',
        autoSkip: true,
        autoSkipPadding: 50
      }
    },
    y: {
      ticks: {
        color: 'white'
      },
      grid: {
        color: 'rgb(121, 121, 121)'
      }
    }
  }
}

export default options
