<script>
  export let metrics
</script>

<flexbox>
  <h2 style="">Node: Simple <br />System Monitor</h2>
  <div id="liveSysData">
    <ul id="topMetrics">
      <li><span class="hostname">{metrics.at(-1)?.meta.hostname}</span></li>
      <li>Cpu:{(metrics.at(-1)?.cpu * 100).toFixed(2)}%</li>
      <li>Mem:{(metrics.at(-1)?.usedMem * 100).toFixed(2)}%</li>
      <li>
        Total Mem <br />
        Reported:{metrics.at(-1)?.totalMem}M
      </li>
      <li style="color: magenta;">{metrics.at(-1)?.time}</li>
    </ul>
  </div>
</flexbox>

<style>
  liveSysyData {
    height: 13em;
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
  /* div {
    border-radius: 0.5em;
    border: solid white 1.5px;
  } */
  h2 {
    font-size: 1.5em;
    color: white;
    text-shadow: 1.5px 1.5px 1.5px black;
    font-family: 'Courier New', Courier, monospace;
    margin-top: 0;
  }
  ul {
    list-style-type: none;
  }
  li {
    margin-left: -1.5em;
  }
</style>
