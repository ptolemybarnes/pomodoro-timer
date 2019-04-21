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

const createTimer = startingTime => {
  let currentTime = createCurrentTime(startingTime)
  let change = () => {}
  let finish = () => {}
  let interval;
  return {
    start: () => {
      interval = setInterval(() => {
        const newTime = currentTime.increment(-1000)
        change(newTime)
        if(newTime === 0) { 
          clearInterval(interval)
          finish()
        }
      }, 1000)
    },
    pause: () => { clearInterval(interval) },
    onChange: fn => { change = fn },
    onFinish: fn => { finish = fn },
    destroy: () => clearInterval(interval),
    toString: () => currentTime.toString(),
    id: uuidv1()
  }
}

export default createTimer
