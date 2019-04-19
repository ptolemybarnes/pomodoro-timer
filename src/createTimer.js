import uuidv1 from 'uuid/v1';

const createCurrentTime = (time) => {
  return {
    increment: increment => {
      const newTime = time + increment
      if (newTime <= 0) {
        return time
      }
      time = newTime
      return time
    },
    isZero: () => time < 0,
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
        if(currentTime.isZero()) { 
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
