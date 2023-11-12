<script>
  import { Bar } from 'svelte-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement } from 'chart.js'
  import options from '$lib/charts/processesOptions.js'

  ChartJS.register(Title, Tooltip, Legend, BarElement)

  export let metrics
  let chartData
  let skip = false

  function updateData(metrics) {
    skip = !skip
    if (skip === true) return
    metrics?.at(-1)?.processes.cpu.sort((a, b) => {
      return a.process.toUpperCase() < b.process.toUpperCase() ? -1 : 1
    })

    chartData = {
      title: 'Processes',
      labels: metrics?.at(-1)?.processes.cpu.map((x) => x.process),
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
          parsing: { xAxisKey: 'process', yAxisKey: 'cpu' },
          label: '',
          data: metrics?.at(-1)?.processes.cpu
          // data: metrics?.at(-1)?.processes.cpu.map((x) => x.cpu)
        }
      ]
    }
  }
  $: updateData(metrics)
</script>

{#if JSON.stringify(metrics) !== ''}
  <Bar data={chartData} {options} />
{/if}
