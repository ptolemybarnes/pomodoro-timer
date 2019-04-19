import uuidv1 from 'uuid/v1';

const createTimer = startingTime => {
  let currentTime = startingTime
  let change = () => {}
  let interval;
  return {
    start: () => {
      interval = setInterval(() => {
        (currentTime = currentTime - 1000);
        console.log('current time: ', currentTime)
        change(currentTime)
      }, 1000)
    },
    pause: () => { clearInterval(interval) },
    onChange: fn => { change = fn },
    toString: () => currentTime,
    id: uuidv1()
  }
}

export default createTimer
