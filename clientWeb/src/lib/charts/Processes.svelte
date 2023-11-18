<script>
  import { Bar } from 'svelte-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement } from 'chart.js'
  import options from '$lib/charts/processesOptions.js'
  ChartJS.register(Title, Tooltip, Legend, BarElement)
  ChartJS.defaults.font.family = 'Montserrat-Light'
  ChartJS.defaults.font.weight = 'normal'
  // Set the postion of the tooltop so it isn't at the top of bars
  Tooltip.positioners.toolTipPositioner = function (elements, eventPosition) {
    return { x: eventPosition.x, y: eventPosition.y }
  }

  export let metrics
  export let cpuMem
  let chartData
  let skip = true

  async function updateData(metrics) {
    try {
      chartData = await new Promise(async (res, rej) => {
        if (!metrics?.at(-1)?.processes?.[cpuMem]) {
          rej(new Error('No metrics data'))
        }
        skip = !skip
        if (skip === true) return
        metrics?.at(-1)?.processes[cpuMem].sort((a, b) => {
          return a.process.toUpperCase() < b.process.toUpperCase() ? -1 : 1
        })
        res({
          title: 'Processes',
          labels: metrics?.at(-1)?.processes[cpuMem].map((x) => x.process),
          datasets: [
            {
              backgroundColor: [
                '#005C56',
                '#003f5c',
                '#2f4b7c',
                '#665191',
                '#a05195',
                '#d45087',
                '#f95d6a',
                '#ff7c43',
                '#ffa600'
              ],
              parsing: { xAxisKey: 'process', yAxisKey: cpuMem },

              data: metrics?.at(-1)?.processes[cpuMem]
            }
          ]
        })
      })
    } catch (e) {
      console.warn(e)
    }
  }
  $: if (metrics) updateData(metrics)
</script>

{#await metrics && chartData then}
  <Bar data={chartData} {options} />
{/await}
