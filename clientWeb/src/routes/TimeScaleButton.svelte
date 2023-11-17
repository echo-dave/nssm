<script>
  export let minutes
  export let time
  export let changeDataLength

  const setButtonActive = (el) => {
    // console.log('button run')
    try {
      // let activeButton = document.querySelectorAll('.timeSelection')
      // activeButton.classList.remove('timeSelection')
      el.target.closest('button').classList.add('timeSelection')
      // console.log('complete')
    } catch (e) {
      console.error(e)
    }
  }
</script>

<button
  class={minutes == time ? 'timeSelection' : ''}
  on:click={(e) => {
    minutes = time
    {
      changeDataLength()
    }
    {
      setButtonActive(e)
    }
    // console.log('click')
  }}>{time}m</button
>

<style>
</style>
