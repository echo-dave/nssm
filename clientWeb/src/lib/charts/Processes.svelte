<script>
  // import { Bar } from 'svelte-chartjs'
  import { Chart, BarController, Title, Tooltip, Legend, BarElement } from 'chart.js'
  import options from '$lib/charts/processesOptions.js'
  import { onMount } from 'svelte'
  Chart.register(BarController, Title, Tooltip, Legend, BarElement)
  Chart.defaults.font.family = 'Montserrat-Light'
  Chart.defaults.font.weight = 'normal'
  // Set the postion of the tooltop so it isn't at the top of bars
  Tooltip.positioners.toolTipPositioner = function (elements, eventPosition) {
    return { x: eventPosition.x, y: eventPosition.y }
  }

  export let metrics
  export let cpuMem
  export let barProcessDetail

  let myChart
  let ctx
  let myCanvas
  let chartData
  let skip = true

  onMount(() => {
    ctx = myCanvas.getContext('2d')
    myChart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: options
    })
  })

  async function updateData(metrics) {
    try {
      return (chartData = await new Promise(async (res, rej) => {
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
      }))
    } catch (e) {
      console.warn(e)
    }
  }
  $: if (metrics) {
    ;(async () => {
      try {
        myChart.data = await updateData(metrics)
        // console.log(myChart.data)

        // console.log('are we updating?')
        // myChart.destroy()
        myChart.update()
      } catch (e) {
        ;('awaiting data')
      }
    })()
  }

  //on chart click pull all process info onto display
  const getToolTipData = (evt) => {
    const res = myChart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true)
    if (res.length === 0) {
      return
    }
    barProcessDetail = myChart.data.datasets[res[0].datasetIndex].data[res[0].index]
  }
</script>

<!-- {#await metrics && chartData then} -->
<!-- <Bar data={chartData} {options} /> -->
<canvas
  on:click={(e) => {
    getToolTipData(e)
  }}
  bind:this={myCanvas}
/>
<!-- {/await} -->
