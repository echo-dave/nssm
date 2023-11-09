<script>
  import { Bar } from 'svelte-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement } from 'chart.js'

  ChartJS.register(Title, Tooltip, Legend, BarElement)

  export let metrics
  let chartData
  function updateData(metrics) {
    chartData = {
      title: 'Processes',
      datasets: [
        {
          data: metrics?.reverse()[0]?.processes?.cpu?.map((x) => {
            return { cpu: x.cpu, process: x.process }
          })
        }
      ]
    }
  }
  $: updateData(metrics)
</script>

{#if JSON.stringify(metrics) !== ''}
  <Bar data={chartData} />
{/if}
