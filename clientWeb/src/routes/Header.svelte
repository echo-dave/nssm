<script>
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
  <h2>Simple <br />System Monitor</h2>
  <div id="liveSysData">
    <ul id="topMetrics">
      <li><span class="hostname">{metrics.at(-1)?.meta.hostname}</span></li>
      <li>Cpu:{(metrics.at(-1)?.cpu * 100).toFixed(2)}%</li>
      <li>Mem:{(metrics.at(-1)?.usedMem * 100).toFixed(2)}%</li>
      <li>
        Total Mem <br />
        Reported:{metrics.at(-1)?.totalMem}M
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
