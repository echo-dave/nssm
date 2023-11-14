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
  async function updateData(metrics) {
    try {
      chartData = await new Promise(async (res, rej) => {
        if (!metrics) {
          rej(new Error('No metrics data'))
        }
        res({
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
        })
      })
    } catch (e) {
      console.error(e)
    }
  }
  $: if (metrics) updateData(metrics)
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
{#await metrics && chartData then}
  <Line class="inner-chart-container" data={chartData} {options} />
{/await}

<!-- </div> -->
