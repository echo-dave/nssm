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
        callback: function (val, index) {
          // Hide every 2nd tick label
          return index % 5 === 0 ? this.getLabelForValue(val) : ''
        },
        color: 'white',
        grid: { display: false }
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
