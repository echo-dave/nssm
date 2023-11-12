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
</script>

<flexbox>
  <div id="liveSysData">
    <div class="no-border" style="flex: 1 1;">
      <span class="hostname">{metrics.at(-1)?.meta.hostname}</span>
      <div class="meters no-border">
        <div class="currentUsage no-border">
          <CurrentUsage metrics={metrics.at(-1)?.usedMem} labelChart="MEM" titleText="Used MEM" />
        </div>
        <div class="currentUsage no-border">
          <CurrentUsage metrics={metrics.at(-1)?.cpu} labelChart="CPU" titleText="Used CPU" />
        </div>
      </div>
    </div>
    <ul id="topMetrics" style="flex: 1 1;">
      <li><h2>Simple <br />System Monitor</h2></li>

      <!-- <li>Cpu:{(metrics.at(-1)?.cpu * 100).toFixed(2)}%</li>
      <li>Mem:{(metrics.at(-1)?.usedMem * 100).toFixed(2)}%</li> -->
      <li>
        Mem Reported:{metrics.at(-1)?.totalMem}M
      </li>
      <li style="color: magenta;">
        {currentTime}
      </li>
    </ul>
  </div>
</flexbox>

<style>
  #liveSysData {
    height: 12em;
    display: flex;
    flex-direction: row;
  }
  .meters {
    display: flex;
    flex-direction: row;
  }
  .meters div {
    flex: 1 1;
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
    padding-right: 1em;
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

  @media screen and (max-width: 540px) {
    flexbox {
      flex-direction: column;
      gap: 0.5em;
      justify-content: flex-start;
    }
    flexbox h2 {
      margin-bottom: 0.5em;
    }
  }
</style>
