<script>
  import './styles.scss'
  import Header from './Header.svelte'
  import { onMount } from 'svelte'
  import { io } from 'socket.io-client'
  import CpuData from '$lib/charts/CpuData.svelte'
  import MemData from '$lib/charts/MemData.svelte'
  import TimeScaleButton from './TimeScaleButton.svelte'
  import Processes from '../lib/charts/Processes.svelte'

  const socket = io()
  let metrics
  let minutes = 10
  let time = [0.5, 15, 60]
  let hostname
  let processDisplayCpu = true
  let barProcessDetail
  const ioSubscriptions = new Set()
  export let data

  const subscribe = (hostname) => {
    console.log('subscribe to:', hostname)
    ioSubscriptions.add(hostname)
    if (socket.connected) socket.emit('subscribe', hostname)
  }

  const unsubscribe = (hostname) => {
    console.log('host to delete', hostname)
    const deleted = ioSubscriptions.delete(hostname)
    console.log('deleted: ', deleted)
    if (deleted && socket.connected) socket.emit('unsubscribe', hostname)
  }

  const hostData = (newData) => {
    newData.time = new Date(newData.time)
    metrics = [...metrics, newData]
    if (metrics.length > minutes * 30) metrics.shift()
  }

  onMount(async () => {
    metrics = data.metrics
    hostname = metrics[0].meta.hostname
    subscribe(hostname)

    socket.on('connect', () => {
      console.log('connect Subscribe', ioSubscriptions)
      if (ioSubscriptions.size) socket.emit('subscribe', [...ioSubscriptions])
      else subscribe(hostname)
    })

    socket.on('dataA', (inData, ack) => {
      hostData(inData)
      ack('ok')
    })

    socket.on('dataB', (inData, ack) => {
      hostData(inData)
      ack('ok')
    })
  })

  const changeDataLength = () => {
    let dataPointsCount = minutes * 30
    if (metrics.length > dataPointsCount) {
      metrics = metrics.slice(-dataPointsCount)
    }
    if (dataPointsCount > metrics.length) {
      updateDataPoints(dataPointsCount)
    }
  }

  const updateDataPoints = async (count) => {
    try {
      if (count > metrics.length + 1) {
        let res = await fetch(`/api/tsClientData/${hostname}/${count}`)
        if (!res.ok) {
          throw new Error({ error: res, msg: 'Failed to get client data' })
        }
        res = await res.json()
        res.map(async (el) => {
          el.time = new Date(el.time)
        })
        res.reverse()
        metrics = res
      }
    } catch (e) {
      console.warn(e)
    }
  }

  async function copyProcessInfo(e) {
    const clipData = await navigator.clipboard.writeText(
      e.target.closest('.process-value').textContent
    )
    const processListItemConted = e.target.closest('.process-details')
    const processKey = processListItemConted.querySelector('.process-key')
    document
      .querySelector('.right ul')
      .insertAdjacentHTML(
        'beforebegin',
        `<span id='clickProcessValue' class='fade-in'><p>Copied <span style='color:white'>${processKey.textContent}'s</span> value!</p></span>`
      )
    setTimeout(() => {
      document.querySelector('#clickProcessValue').classList.add('fade-out')
      setTimeout(() => document.querySelector('#clickProcessValue').remove(), 150)
    }, 2500)
  }
</script>

<svelte:head>
  <title>Simple System Monitor</title>
  <meta name="description" content="Nodesysmon a simple system monitor" />
</svelte:head>
<div id="wrap" class="no-border">
  <Header bind:metrics bind:hostname {subscribe} {unsubscribe} {minutes} />

  <div id="chartTimeScaleButtons" class="no-border">
    <div class="left no-border">
      <div id="time-buttons" class="no-border">
        {#each time as timeElement}
          <TimeScaleButton bind:minutes time={timeElement} {changeDataLength} />
        {/each}
      </div>
      <span id="lineCharInfo">History for the last {minutes} minutes</span>
    </div>
    <div class="right no-border">
      {#if barProcessDetail}
        <ul class="process-details" on:click={(e) => copyProcessInfo(e)}>
          {#each Object.entries(barProcessDetail) as [key, value]}
            <li class="process-details">
              <span class="process-key">{key}</span>:
              <span role="button" class="process-value">{value}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>

  <section id="main-charts">
    <div class="chart-container no-border">
      <CpuData {metrics} />
      <MemData {metrics} />
    </div>
    <div class="chart-processes">
      <button id="swapProcesses" on:click={() => (processDisplayCpu = !processDisplayCpu)}>
        <img
          alt="swap process chart sort"
          src="/imgs/changeProcessChart_white.svg"
          height="20px"
          width="20px"
        />
      </button>
      {#if processDisplayCpu === true}
        <h2 class="chartTitle">Processes by CPU use</h2>
        <Processes {metrics} cpuMem="cpu" bind:barProcessDetail />
      {:else}
        <h2 class="chartTitle">Processes by MEM use</h2>
        <Processes {metrics} cpuMem="mem" bind:barProcessDetail />
      {/if}
    </div>
  </section>
</div>

<style lang="scss">
  #swapProcesses {
    cursor: pointer;
    background: rgba(51, 51, 51);
    position: absolute;
    right: -0.5em;
    top: -0.5em;
    z-index: 4;
    margin: 20px;
    padding: 0;
    min-width: unset;
    border: solid 1px;
    border-radius: 0.5em;
    border-top: solid 0.5px #b4b3b3;
    border-left: solid 0.5px #b4b3b3;
    border-bottom: solid 1px #333;
    border-right: solid 1px #333;
    width: 35px;
    height: 35px;
    img {
      cursor: pointer;
      padding: 0.5em;
    }
  }

  #swapProcesses:active {
    background: linear-gradient(0deg, rgba(150, 150, 150, 0.5), 10%, rgba(51, 51, 51, 0.5));
    color: black;
  }

  #chartTimeScaleButtons {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  #lineCharInfo {
    margin-top: 0;
    flex: 0 0;
    font-size: 1.2em;
  }
  #main-charts {
    display: flex;
    flex-direction: row;
    max-width: 100vw;
    gap: 1.5em;
    justify-content: center;
  }

  .chartTitle {
    font-size: 0.8em;
    text-align: center;
    margin: 0 auto;
    z-index: 2;
    position: absolute;
    top: 1em;
    margin: 0 auto;
    left: 0;
    right: 0;
  }

  div.left,
  div.right {
    flex: 1 1;
    text-align: left;
    position: relative;
  }

  li.process-details {
    list-style: none;
    font-size: 0.85em;
    display: inline-block;
    .process-value {
      color: var(--process-details);
      cursor: pointer;
    }
  }

  li::after {
    content: '|';
    padding: 0 1em;
    color: var(--time-color);
  }

  li:last-child::after {
    content: none;
  }

  div.left {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 0.75em;
  }

  #wrap {
    max-width: 1500px;
    margin: 0 auto;
    padding: 0;
  }
  @media (hover: hover) {
    #swapProcesses:hover {
      border: var(--hostname-color) solid 1px;
      border-radius: 0.5em;
    }
  }
  @media screen and (max-width: 720px) {
    #chartTimeScaleButtons {
      flex-direction: column;
    }
    .left {
      text-align: center;
      margin-top: 0.5em;
      padding-bottom: 0;
    }
    #main-charts {
      flex-direction: column;
      gap: 0.75em;
    }
    .chart-container,
    .chart-processes {
      width: calc(95vw - 0.7em);
      justify-content: center;
      flex: unset;
    }
    .chart-container {
      height: unset;
      margin-top: 0.5em;
    }
  }
</style>
