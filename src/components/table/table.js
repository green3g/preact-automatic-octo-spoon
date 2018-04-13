import capitalize from 'capitalize';
import reactViewModel from 'react-view-model'
import DefineMap from 'can-define/map/map';
import DefineList from 'can-define/list/list';
import style from './table.css';

const RowList = DefineList.extend({
  currentSort: 'string',
  sortBy(field){
    let reverse = 1;
    if(field === this.currentSort){
      reverse = -1;
      this.currentSort = null;
    } else {
      this.currentSort = field;
    }
    this.sort((a, b) => {
      return (a[field] === b[field] ? 0 :
        a[field] > b[field] ? 1 : -1 )* reverse
    })
  }
});

export const ViewModel = DefineMap.extend({
  loadData(){
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(data => { return data.json(); })
      .then(rows => { this.assign({rows})});
  },
  rows: RowList,
  fields: {
    Default: DefineList,
    get(val){
      return val.length ? val : this.rows.length ? Object.keys(this.rows[0]) : []
    }
  }
});

export default  reactViewModel( 
  'AppComponent', 
  ViewModel, 
  (viewModel) => {
    if(!viewModel.rows || !viewModel.rows.length){
      return (
        <div class={style.table}>
          <button class="btn btn-primary"
            onclick={viewModel.loadData.bind(viewModel)}>
            Load Data</button>
          </div>
      )
    }
    const fields = viewModel.fields;
    return (
      <div class={style.table}>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            {fields.map(field => (
              <th onclick={viewModel.rows.sortBy.bind(viewModel.rows, field)}>{capitalize(field)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {viewModel.rows.map((row, idx) => (
            <tr class={idx % 2 === 1 ? 'active' : ''}>
              {fields.map((field) => (
                <td>{row[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    )
  })
