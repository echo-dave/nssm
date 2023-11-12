<script>
  import './styles.scss'
  import Header from './Header.svelte'
  import { onMount } from 'svelte'
  import { io } from 'socket.io-client'
  import CpuData from '$lib/charts/CpuData.svelte'
  import MemData from '$lib/charts/MemData.svelte'
  import Processes from '$lib/charts/Processes.Svelte'
  import TimeScaleButton from './TimeScaleButton.svelte'

  const socket = io()
  // import { background } from '../store'

  let metrics = []
  let minutes = 10
  let time = [0.5, 15, 60]

  export let data
  onMount(async () => {
    metrics = data.data

    socket.on('new data', (newData) => {
      newData.time = new Date(newData.time)
      metrics = [...metrics, newData]
      if (metrics.length > minutes * 30) metrics.shift()
      // console.log('io length: ', metrics.length)
    })
  })

  const changeDataLength = () => {
    console.log('update length')
    console.log('minutes: ', minutes)
    let dataPointsCount = minutes * 30
    if (metrics.length > dataPointsCount) {
      metrics = metrics.slice(-dataPointsCount)
    }
    if (dataPointsCount > metrics.length) {
      updateDataPoints(dataPointsCount)
    }
    console.log(metrics.length, 'count', dataPointsCount)
  }
  const updateDataPoints = async (count) => {
    console.log('update points')
    try {
      if (count > metrics.length + 1) {
        console.log('updating metrics')
        const res = await fetch(`/api/tsClientData/count/:${count}`)
        metrics = await res.json()
      }
    } catch (e) {
      console.error(e)
    }
  }

  // changeDataLength(minutes)
</script>

<head> <title>Simple System Monitor</title></head>

<Header {metrics} />

<div id="chartTimeScaleButtons" class="no-border">
  <div class="left no-border">
    <div id="time-buttons" class="no-border">
      {#each time as timeElement}
        <TimeScaleButton bind:minutes time={timeElement} {changeDataLength} />
      {/each}
    </div>
    <span id="lineCharInfo">History for the last {minutes} minutes</span>
  </div>
  <div class="right no-border"></div>
</div>
<section id="main-charts">
  <div class="chart-container no-border">
    <CpuData {metrics} />
    <MemData {metrics} />
  </div>
  <div class="chart-processes no-border">
    <Processes {metrics} />
  </div>
</section>

<style>
  #chartTimeScaleButtons {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  #lineCharInfo {
    /* text-align: center; */
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

  div.left,
  div.right {
    flex: 1 1;
  }
  div.left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  @media screen and (max-width: 720px) {
    #chartTimeScaleButtons {
      flex-direction: column;
    }
    .left {
      text-align: center;
      margin-bottom: 0.5em;
      margin-top: 0.5em;
    }
    #main-charts {
      flex-direction: column;
    }
    .chart-container,
    .chart-processes {
      width: calc(95vw - 0.7em);
      justify-content: center;
    }
  }
</style>
