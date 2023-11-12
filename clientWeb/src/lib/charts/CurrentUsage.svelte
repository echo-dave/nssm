<script>
  import { Doughnut } from 'svelte-chartjs'
  import { Chart as ChartJS, Legend, Title, ArcElement } from 'chart.js'

  ChartJS.register(Legend, Title, ArcElement)

  export let metrics
  export let labelChart
  export let titleText

  let chartData
  chartData = {
    labels: [labelChart, 'unused'],
    datasets: [
      {
        backgroundColor: ['orange', 'rgba(0, 0, 0, 0)'],
        data: [metrics, 1 - metrics]
      }
    ]
  }

  let options = {
    cutout: '65%',
    scales: {
      yAxes: {
        ticks: {
          max: 1,
          min: 0,
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
  $: chartData.datasets[0].data = [metrics, 1 - metrics]
</script>

{#if JSON.stringify(metrics) !== ''}
  <Doughnut class="no-border" data={chartData} {options} />
{/if}
