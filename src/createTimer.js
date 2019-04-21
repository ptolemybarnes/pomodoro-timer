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

const notify = (listeners) => (...args) => {
  listeners.forEach(listener => listener(...args))
}

const createTimer = startingTime => {
  const currentTime = createCurrentTime(startingTime)
  const listeners = []
  const onChange = notify(listeners)
  let interval;
  return {
    start: () => {
      onChange(currentTime.toString(), MODES.running)
      interval = setInterval(() => {
        const newTime = currentTime.increment(-1000)
        onChange(newTime, MODES.running)
        if(newTime === 0) { 
          clearInterval(interval)
          onChange(newTime, MODES.finished)
        }
      }, 1000)
    },
    pause: () => { 
      clearInterval(interval)
      onChange(currentTime.toString(), MODES.paused)
    },
    onEvent: fn => {
      listeners.push(fn)
    },
    destroy: () => {
      listeners.length = 0
      clearInterval(interval)
    },
    toString: () => currentTime.toString(),
    id: uuidv1()
  }
}

export default createTimer
