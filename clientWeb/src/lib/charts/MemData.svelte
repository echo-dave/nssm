<script>
  import { Line } from 'svelte-chartjs'
  import options from './options.js'
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
  let data
  function updateDate(metrics) {
    data = {
      title: 'System metrics',
      labels: metrics?.map((x) => {
        let time = new Date(x.time)
        return `${time.getMinutes()} : ${time.getSeconds()}`
      }),
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
  $: updateDate(metrics)
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

<div class="chart-container" style="position: relative; height:8000x;">
  {#if JSON.stringify(metrics) !== ''}
    <Line {data} height="800" width="2000" {options} />
  {/if}
</div>

<style>
</style>
