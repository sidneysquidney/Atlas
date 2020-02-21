/* global Application */
/* exported History */

class History {

  constructor() {
    window.onpopstate = event => this.pop(event)
  }

  push(state) {
    let path = '/map'

    if (state.event) {
      path += `/event/${state.event.id}`
    } else if (state.venue) {
      path += `/venue/${state.venue.id}`
    } else if (state.query) {
      path += `?q=${state.query}`
    }

    history.pushState(state, undefined, path)
  }

  pop(event) {
    if (Application.setState(event.state, false)) {
      event.preventDefault()
    }
  }

}