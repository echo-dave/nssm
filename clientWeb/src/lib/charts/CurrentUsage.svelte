<script>
  import { Doughnut } from 'svelte-chartjs'
  import { Chart as ChartJS, Legend, Title, ArcElement, LinearScale } from 'chart.js'

  ChartJS.register(Legend, Title, ArcElement, LinearScale)

  export let metrics
  export let labelChart
  export let titleText
  export let color

  let chartData
  chartData = {
    labels: [labelChart, 'unused'],
    datasets: [
      {
        backgroundColor: [color, 'rgba(0, 0, 0, .1)'],
        data: [metrics, 1 - metrics]
      }
    ]
  }

  let options = {
    animations: false,
    cutout: '65%',
    scales: {
      yAxes: {
        ticks: {
          display: false
        }
      }
    },
    elements: {
      arc: {}
    },
    plugins: {
      title: {
        display: true,
        text: titleText,
        color: 'white'
      },
      legend: {
        display: false
      }
    }
  }
  $: if (metrics) {
    chartData.datasets[0].data = [metrics, 1 - metrics]
    // console.log('meters data update')
  }
</script>

<!-- 
{#if JSON.stringify(metrics) !== ''} -->
<Doughnut class="no-border" data={chartData} {options} />
<!-- {/if} -->
