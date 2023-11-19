<script>
  import CurrentUsage from '$lib/charts/CurrentUsage.svelte'
  import { onMount } from 'svelte'

  export let metrics
  export let subscribe
  export let unsubscribe
  let hostmenutoggle = false
  let currentHost
  //storing a pending promise because svelt needs to await data from the onMount
  let hostnames = new Promise(() => {})
  onMount(() => {
    hostnames = getNames().then((res) => {
      hostnames = res
    })
  })

  const getNames = async () => {
    let response = await fetch('/api/gethostnames')
    if (!response.ok) {
      throw new Error('Hostnames not available')
    }
    response = await response.json()
    currentHost = response.pop()
    console.log(response)
    return response
  }

  const changeServer = async (name) => {
    console.log('changeTo: ', name)
    unsubscribe(currentHost)
    console.log('unsub: ', currentHost)
    subscribe(name)
    let resp = await fetch(`/api/serverchange/${name}`)
    if (!resp.ok) throw new Error(resp.status)
    resp = await resp.json()
    resp.map((el) => {
      el.time = new Date(el.time)
    })
    currentHost = name
    metrics = resp.reverse()
    // metrics = resp
  }
  const formatTime = (metrics) => {
    try {
      return metrics?.at(-1)?.time.toLocaleString('default', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    } catch (e) {
      console.warn('waiting for time data')
    }
  }
  $: currentTime = formatTime(metrics)

  let buildChart
  async function build(metrics) {
    buildChart = new Promise(async (res, rej) => {
      await metrics
      res([
        {
          metrics: metrics?.at(-1)?.usedMem,
          labelChart: 'MEM',
          titleText: 'Used MEM',
          color: 'rgb(178,52,107)'
        },
        {
          metrics: metrics?.at(-1)?.cpu,
          labelChart: 'CPU',
          titleText: 'Used CPU',
          color: 'rgb(57,177,177)'
        }
      ])
      // console.log(metrics.at(-1))
    })
    buildChart.then((response) => {
      buildChart = response
    })
  }
  $: visibilityToggle = hostmenutoggle ? 'visible' : 'hidden'

  $: build(metrics)
</script>

<div id="liveSysData">
  <div class="no-border" style="flex: 1 1;position:relative">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <button
      class="hostname"
      on:click={() => {
        hostmenutoggle = !hostmenutoggle
      }}>{metrics?.at(-1)?.meta.hostname}</button
    >
    {#if true}
      <ul id="hostnames" class:fade-in={hostmenutoggle} style="visibility: {visibilityToggle}">
        {#await hostnames then hostnames}
          {#each hostnames as name}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <li
              on:click={(e) => {
                if (name !== currentHost) changeServer(name)
                hostmenutoggle = false
              }}
            >
              {name}
            </li>
          {/each}
        {:catch error}
          <span style="color: red; padding: 1em 0; display:inline-block">{error}</span>
        {/await}
      </ul>
    {/if}
    <div class="meters no-border">
      {#await buildChart then}
        {#each buildChart as chart}
          <div class="currentUsage no-border">
            <div class="digitDisplay no-border">%<br />{(chart.metrics * 100).toFixed(2)}</div>
            <CurrentUsage {...chart} />
          </div>
        {/each}
      {/await}
    </div>
  </div>
  <ul id="topMetrics" style="flex: 1 1;">
    <li><h1>Simple <br />System Monitor</h1></li>
    <li>
      Mem Reported: {metrics?.at(-1)?.totalMem}M
    </li>
    <li style="color: magenta;">
      {currentTime}
    </li>
  </ul>
</div>
<svelte:window
  on:click={(e) => {
    e.target != document.querySelector('#hostnames') &&
    e.target != document.querySelector('.hostname')
      ? (hostmenutoggle = false)
      : null
  }}
/>

<style>
  #liveSysData {
    height: 12em;
    display: flex;
    flex-direction: row;
    gap: 3.5em;
  }
  .hostname {
    font-size: 1.25em;
    margin-left: 1em;
    padding-top: 0.5em;
    display: inline-block;
    cursor: pointer;
    color: var(--hostname-color);
    background: none;
    border: none;
    text-transform: none;
  }
  #hostnames {
    position: absolute;
    z-index: 2;
    background: rgba(0, 0, 0, 0.85);
    padding: 0.5em 2.5em;
    border-radius: 0.5em;
    left: 1.5em;
    top: 1.25em;
    cursor: pointer;
    visibility: visible;
    display: inline-block;
  }

  #hostnames li:hover {
    color: aqua;
    margin-left: -1.4em;
  }
  #hostnames li:hover::before {
    content: '•';
    margin-left: -0.5em;
  }

  .meters {
    display: flex;
    flex-direction: row;
  }
  .meters div {
    flex: 0 1;
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
  #topMetrics :not(:first-child) {
    margin-bottom: 0.15em;
  }
  .currentUsage {
    width: 150px;
    height: 150px;
    position: relative;
  }
  .digitDisplay {
    position: absolute;
    width: 100%;
    text-align: center;
    margin-top: calc(50% - 0.5em);
    font-size: 0.7em;
    margin-left: 0.5em;
  }
  .fade-in {
    opacity: 0;
    animation: fade-in 0.25s ease-in forwards;
  }

  @keyframes fade-in {
    100% {
      opacity: 1;
    }
  }

  @media screen and (max-width: 720px) {
    #liveSysData {
      flex-direction: column-reverse;
      height: auto;
      gap: 0.5em;
      padding-bottom: 1.2em;
    }
  }
</style>
