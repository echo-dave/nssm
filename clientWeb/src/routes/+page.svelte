<script>
  import Header from './Header.svelte'
  import { onMount } from 'svelte'
  import { io } from 'socket.io-client'
  import CpuData from '../lib/charts/CpuData.svelte'
  import MemData from '../lib/charts/MemData.svelte'
  //   import Test from '../lib/charts/Test.svelte'

  const socket = io()

  // import { background } from '../store'

  //   onMount(async () => {
  //     let beans = await fetch('/api/tsClientData')
  //     beans = await beans.json()
  //     console.log('more beans')
  //   })
  let metrics = []
  socket.on('new data', (data) => {
    metrics = [...metrics, data]
    if (metrics.length > 10 * 30) metrics.shift()
  })
</script>

<head> <title>Simple System Monitor</title></head>

<Header {metrics} />
<CpuData {metrics} />
<MemData {metrics} />

<style>
  :global(body) {
    background: rgb(52, 52, 52);
    color: whitesmoke;
  }
  :global(.chart-container) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 99vw;
    height: 250px;
    padding: 0 1.5em 0 0.5em;
    box-sizing: border-box;
    margin: 1em 0;
  }
  :global(canvas) {
    border-radius: 0.5em;
    /* box-shadow: 4px 4px 12px black; */
    border: solid white 1.5px;
    padding: 0.25em;
    box-sizing: content-box;
  }
</style>
