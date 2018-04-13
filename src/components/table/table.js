import {h, Component} from 'preact'
import capitalize from 'capitalize';

export default class Table extends Component {
  constructor(){
    super();
    this.state = {
      rows: [],
      fields: [],
      getFields(){
        if(!this.rows.length){
          return [];
        }
        return this.fields.length ? this.fields: Object.keys(this.rows[0])
      }
    }

    fetch('https://jsonplaceholder.typicode.com/users')
      .then(data => { return data.json() })
      .then(rows => {
        this.setState({
          rows
        })
      })
  }

  render(){
    if(!this.state.rows){
      return (
        'Loading...'
      )
    }
    const fields = this.state.getFields();
    return (
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            {fields.map(field => (
              <th>{capitalize(field)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.state.rows.map((row, idx) => (
            <tr class={idx % 2 === 1 ? 'active' : ''}>
              {fields.map((field) => (
                <td>{row[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}
