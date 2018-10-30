const etch = require('etch')

class MyComponent {
  // Define an ordinary constructor to initialize your component.
  constructor (props, children) {
    // perform custom initialization here...
    // then call `etch.initialize`:
    etch.initialize(this)
  }

  // The `render` method returns a virtual DOM tree representing the
  // current state of the component. Etch will call `render` to build and update
  // the component's associated DOM element. Babel is instructed to call the
  // `etch.dom` helper in compiled JSX expressions by the `@jsx` pragma above.
  render () {
    return <div>Hello, {name}!</div>
  }

  // Update the component with new properties and children.
  update (props, children) {
    return etch.update(this)
  }
}
