import React, { Component } from 'react';
import './App.css';
import createTimer from './createTimer'

const NotStartedTimer = ({ start, timeRemaining, setTimeRemaining }) => (
  <>
  <input autoFocus type='number' value={timeRemaining} onChange={setTimeRemaining} />
  <p>Time remaining: { timeRemaining } </p>
  <button onClick={start}>Start</button>
  </>
)

const RunningTimer = ({ timeRemaining, pause, reset }) => (
  <>
  <p>Time remaining: { timeRemaining } </p>
  <button onClick={pause}>Pause</button>
  <button onClick={reset}>Reset</button>
  </>
)

const PausedTimer = ({ timeRemaining, start, reset }) => (
  <>
  <p>Time remaining: { timeRemaining } </p>
  <button onClick={start}>Start</button>
  <button onClick={reset}>Reset</button>
  </>
)

class Timer extends Component {
  constructor(props) {
    super(props)
    this.state = { timerMode: 'notStarted', timeRemaining: props.timer.toString() }
    props.timer.onEvent((newTimeRemaining, mode) => this.setState({ timeRemaining: newTimeRemaining, mode }))
  }

  componentWillUnmount() {
    this.props.timer.destroy()
  }

  start = () => {
    this.props.timer.start()
  }

  pause = () => {
    this.props.timer.pause();
  }

  setTimeRemaining = (event) => {
    this.props.reset(Number(event.target.value))
  }

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
class App extends Component {
  constructor(props) {
    super(props)
    const timer = createTimer(DEFAULT_START_TIME)
    this.state = { timer, timerId: timer.id }
  }

  render() {
    const reset = (startTime = DEFAULT_START_TIME) => {
      const timer = createTimer(startTime)
      this.setState({ timer, timerId: timer.id })
    }
    return (
      <div className="App">
        <Timer reset={reset} key={this.state.timerId} timer={this.state.timer} />
      </div>
    )
  }
}

export default App;
