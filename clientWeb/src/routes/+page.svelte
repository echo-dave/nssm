<script>
  import Header from './Header.svelte';
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';

  const socket = io();

  // import { background } from '../store'

  onMount(async () => {
    let beans = await fetch('/api/tsClientData');
    beans = await beans.json();
    console.log('more beans');
  });
  let metrics = {};
  socket.on('new data', (data) => {
    metrics = data;
  });
</script>

<head> <title>Simple System Monitor</title></head>

<Header />
<p>Does this update on the page?</p>
<span>
  {JSON.stringify(metrics)}
</span>

<style>
  :global(body) {
    background: rgb(126, 126, 126);
  }
</style>
