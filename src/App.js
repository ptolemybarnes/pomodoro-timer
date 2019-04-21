import React, { Component } from 'react';
import './App.css';
import createTimer from './createTimer'

const rightPad = (number) => {
  if(number.length > 1) {
    return String(number).slice(0, 2)
  }
  return rightPad(number < 10 ? '0' + number : number + '0')
}

const padAndRound = number => rightPad(Math.floor(number))

const format = ms => {
  const seconds = Number(ms) / 1000
  const remainder = (seconds % 60)
  const minutes = (seconds - remainder) / 60
  return `${padAndRound(minutes)}:${padAndRound(remainder)}`
}

const NotStartedTimer = ({ start, timeRemaining, setTimeRemaining }) => (
  <>
  <input autoFocus type='number' value={timeRemaining} onChange={setTimeRemaining} />
  <p>Time remaining: { format(timeRemaining) } </p>
  <button onClick={start}>Start</button>
  </>
)

const RunningTimer = ({ timeRemaining, pause, reset }) => (
  <>
  <p>Time remaining: { format(timeRemaining) } </p>
  <button onClick={pause}>Pause</button>
  <button onClick={reset}>Reset</button>
  </>
)

const PausedTimer = ({ timeRemaining, start, reset }) => (
  <>
  <p>Time remaining: { format(timeRemaining) } </p>
  <button onClick={start}>Start</button>
  <button onClick={reset}>Reset</button>
  </>
)

const debug = fn => (...args) => {
  console.log('CHANGE: ', args.join(', '));
  return fn(...args)
}

class Timer extends Component {
  constructor(props) {
    super(props)
    this.state = { timerMode: 'notStarted', timeRemaining: props.timer.toString() }
    props.timer.onEvent(debug(this.onTimerEvent))
  }

  componentWillUnmount = () => this.props.timer.destroy()

  onTimerEvent = (newTimeRemaining, mode) => this.setState({ timeRemaining: newTimeRemaining, mode })

  start = () => this.props.timer.start()

  pause = () => this.props.timer.pause()

  setTimeRemaining = (event) => this.props.reset(Number(event.target.value))

  render() {
    const { reset } = this.props
    const { timeRemaining } = this.state
    switch(this.state.mode) {
      case 'paused':
        return (
          <PausedTimer reset={() => reset()} start={this.start} timeRemaining={timeRemaining} />
        )
      case 'running':
        return (
          <RunningTimer reset={() => reset()} pause={this.pause} timeRemaining={timeRemaining} />
        )
      case 'finished':
        return (<p>Timer done!</p>)
      default:
        return <NotStartedTimer start={this.start} timeRemaining={timeRemaining} setTimeRemaining={this.setTimeRemaining} />
    }
  }
}

const DEFAULT_START_TIME = 20000
const DEFAULT_BREAK_START_TIME = 5000
class App extends Component {
  constructor(props) {
    super(props)
    const timer = createTimer(DEFAULT_START_TIME)
    this.state = { timer, timerId: timer.id }
  }

  reset = (startTime = DEFAULT_START_TIME) => {
    const timer = createTimer(startTime)
    timer.onEvent((_, mode) => mode === 'finished' ? this.startBreak() : null)
    this.setState({ timer, timerId: timer.id })
  }

  startBreak = (startTime = DEFAULT_BREAK_START_TIME) => {
    const timer = createTimer(startTime)
    timer.start()
    timer.onEvent((_, mode) => mode === 'finished' ? this.reset() : null)
    this.setState({ timer, timerId: timer.id })
  }

  render() {
    return (
      <div className="App">
        <Timer reset={this.reset} key={this.state.timerId} timer={this.state.timer} startBreak={this.startBreak} />
      </div>
    )
  }
}

export default App;
