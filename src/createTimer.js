import uuidv1 from 'uuid/v1';

const createCurrentTime = (time) => {
  return {
    increment: increment => {
      const newTime = Math.max(0, time + increment)
      time = newTime
      return time
    },
    toString: () => String(time)
  }
}

const MODES = {
  running: 'running',
  paused: 'paused',
  finished: 'finished'
}

const createTimer = startingTime => {
  let currentTime = createCurrentTime(startingTime)
  let change = () => {}
  let interval;
  return {
    start: () => {
      change(currentTime.toString(), MODES.running)
      interval = setInterval(() => {
        const newTime = currentTime.increment(-1000)
        change(newTime, MODES.running)
        if(newTime === 0) { 
          clearInterval(interval)
          change(newTime, MODES.finished)
        }
      }, 1000)
    },
    pause: () => { 
      clearInterval(interval)
      change(currentTime.toString(), MODES.paused)
    },
    onEvent: fn => { change = fn },
    destroy: () => clearInterval(interval),
    toString: () => currentTime.toString(),
    id: uuidv1()
  }
}

export default createTimer
