import React, { Component } from 'react';
import './App.css';
import createTimer from './createTimer'

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
    this.state = { isTimerStarted: false, timeRemaining: props.timer.toString() }
    props.timer.onChange((newTimeRemaining) => this.setState({ timeRemaining: newTimeRemaining }))
    props.timer.onFinish(() => this.setState({ timerFinished: true }))
  }

  start = () => {
    this.setState({ isTimerStarted: true })
    this.props.timer.start()
  }

  componentWillUnmount() {
    this.props.timer.destroy()
  }

  pause = () => {
    this.setState({ isTimerStarted: false })
    this.props.timer.pause();
  }

  render() {
    const { reset } = this.props
    const { timeRemaining } = this.state
    if(!this.state.isTimerStarted) {
      return (
        <PausedTimer reset={reset} start={this.start} timeRemaining={timeRemaining} />
      )
    } else {
      return (
        <RunningTimer reset={reset} pause={this.pause} timeRemaining={timeRemaining} />
      );
    }
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    const timer = createTimer(20000)
    this.state = { timer, timerId: timer.id }
  }

  render() {
    const reset = () => {
      const timer = createTimer(20000)
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
