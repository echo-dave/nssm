<script>
  import CurrentUsage from '$lib/charts/CurrentUsage.svelte'

  export let metrics
  $: currentTime = metrics.at(-1)?.time.toLocaleString('default', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  let buildChart = new Promise(async (res, rej) => {
    await metrics
    res([
      { metrics: metrics.at(-1)?.usedMem, labelChart: 'MEM', titleText: 'Used MEM' },
      { metrics: metrics.at(-1)?.cpu, labelChart: 'CPU', titleText: 'Used CPU' }
    ])
  })
  buildChart.then((response) => {
    buildChart = response
  })
</script>

<!-- <flexbox> -->
<div id="liveSysData">
  <!-- flex  -->
  <div class="no-border" style="flex: 1 1;">
    <span class="hostname">{metrics.at(-1)?.meta.hostname}</span>
    <div class="meters no-border">
      {#await buildChart then}
        {#each buildChart as chart}
          <div class="currentUsage no-border">
            <CurrentUsage {...chart} />
          </div>
        {/each}
      {/await}
    </div>
  </div>
  <ul id="topMetrics" style="flex: 1 1;">
    <li><h2>Simple <br />System Monitor</h2></li>

    <!-- <li>Cpu:{(metrics.at(-1)?.cpu * 100).toFixed(2)}%</li>
      <li>Mem:{(metrics.at(-1)?.usedMem * 100).toFixed(2)}%</li> -->
    <li>
      Mem Reported: {metrics.at(-1)?.totalMem}M
    </li>
    <li style="color: magenta;">
      {currentTime}
    </li>
  </ul>
</div>

<!-- </flexbox> -->

<style>
  #liveSysData {
    height: 12em;
    display: flex;
    flex-direction: row;
    gap: 3.5em;
  }
  .hostname {
    margin-left: 1em;
    padding-top: 0.5em;
    display: inline-block;
  }
  .meters {
    display: flex;
    flex-direction: row;
  }
  .meters div {
    flex: 0 1;
  }
  flexbox {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    gap: 2em;
    margin-bottom: 0.5em;
  }

  #topMetrics {
    margin-top: 1.5em;
    width: 250px;
  }
  ul {
    list-style-type: none;
  }
  li {
    margin-left: -1.5em;
  }

  .currentUsage {
    width: 150px;
    height: 150px;
  }

  @media screen and (max-width: 720px) {
    flexbox {
      flex-direction: column;
      gap: 0.5em;
      justify-content: flex-start;
    }
    #liveSysData {
      flex-direction: column-reverse;
      height: auto;
      gap: 0.5em;
      padding-bottom: 1.2em;
    }
  }
</style>
