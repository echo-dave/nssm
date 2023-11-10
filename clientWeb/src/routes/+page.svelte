<script>
  import './styles.scss'
  import Header from './Header.svelte'
  import { onMount } from 'svelte'
  import { io } from 'socket.io-client'
  import CpuData from '../lib/charts/CpuData.svelte'
  import MemData from '../lib/charts/MemData.svelte'
  import Processes from '../lib/charts/Processes.Svelte'
  //   import Test from '../lib/charts/Test.svelte'

  const socket = io()
  // import { background } from '../store'

  let metrics = []
  let minutes = 10
  export let data
  onMount(async () => {
    metrics = data.data

    socket.on('new data', (newData) => {
      newData.time = new Date(newData.time)
      metrics = [...metrics, newData]
      if (metrics.length > minutes * 30) metrics.shift()
      console.log('io length: ', metrics.length)
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
    console.log(metrics.length, 'count', dataPointsCount)
  }
  const updateDataPoints = async (count) => {
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

  const setButtonActive = (el) => {
    console.log(el)
    let activeButton = document.querySelector('.timeSelection')
    activeButton.classList.remove('timeSelection')
    el.target.classList.add('timeSelection')
  }
</script>

<head> <title>Simple System Monitor</title></head>

<Header {metrics} />
<button
  on:click={(e) => {
    minutes = 0.5
    changeDataLength()
    setButtonActive(e)
  }}>30s</button
>
<button
  class="timeSelection"
  on:click={(e) => {
    minutes = 15
    changeDataLength()
    setButtonActive(e)
  }}>15m</button
>
<button
  on:click={(e) => {
    minutes = 60
    changeDataLength()
    setButtonActive(e)
  }}>1h</button
>

<div class="chart-container no-border">
  <CpuData {metrics} />
  <MemData {metrics} />
  <!-- <Processes {metrics} /> -->
</div>

<style>
  /* :global(.chart-container) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 99vw;
    height: 250px;
    padding: 0 1.5em 0 0.5em;
    box-sizing: border-box;
    margin: 1em 0;
  } */

  button.timeSelection {
    background-color: rgb(17, 217, 217);
  }
  .chart-container {
    flex: 1 1;
    display: flex;
    /* align-items: center; */
    /* justify-content: space-around; */
    box-sizing: border-box;
    width: 45vw;
    height: 400px;
    flex-direction: column;
    align-content: start;
  }
</style>
