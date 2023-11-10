<script>
  import { Line } from 'svelte-chartjs'
  import options from './dataOptions.js'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Filler
  } from 'chart.js'

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Filler
  )
  export let metrics
  // console.log(metrics)
  let chartData
  function updateData(metrics) {
    chartData = {
      title: 'System metrics',
      labels: metrics?.map((x) => x.time),
      // return `${time.getMinutes()} : ${time.getSeconds()}`
      datasets: [
        {
          label: 'memory use percentage',
          fill: false,
          borderColor: 'rgb(255, 139, 189)',
          tension: 0,
          data: metrics?.map((x) => (x.usedMem * 100).toFixed(2)),
          showLine: true,
          borderWidth: 1
        }
      ]
    }
  }
  $: updateData(metrics)
  ChartJS.defaults.color = 'white'
  // $: data = data
  // chartRef.update()

  //   function updateCharts(chartRef) {
  //     chartRef.update()
  //   }
  //   $: if (metrics.length < 300) {
  //     updateCharts()
  //   }
</script>

<!-- <div class="inner-chart-container" style="position: relative;"> -->
{#if JSON.stringify(metrics) !== ''}
  <Line class="inner-chart-container" data={chartData} {options} />
{/if}

<!-- </div> -->

<style>
</style>
