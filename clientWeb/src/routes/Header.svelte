<script>
  export let metrics
</script>

<flexbox>
  <h2 style="">Node: Simple <br />System Monitor</h2>
  <div id="liveSysData">
    <ul id="topMetrics">
      <li><span class="hostname">{metrics[0]?.meta.hostname}</span></li>
      <li>Cpu:{(metrics[0]?.cpu * 100).toFixed(2)}%</li>
      <li>Mem:{(metrics[0]?.usedMem * 100).toFixed(2)}%</li>
      <li>
        Total Mem <br />
        Reported:{metrics[0]?.totalMem}M
      </li>
    </ul>
  </div>
</flexbox>

<style>
  flexbox {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    gap: 2em;
    margin-bottom: 0.5em;
  }
  .hostname {
    font-size: 1.25em;
    font-weight: 800;
    color: greenyellow;
  }
  #topMetrics {
    margin-top: 1.5em;
    padding-right: 1em;
    width: 250px;
  }
  div {
    border-radius: 0.5em;
    /* box-shadow: 4px 4px 8px black; */
    border: solid white 1.5px;
  }
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
