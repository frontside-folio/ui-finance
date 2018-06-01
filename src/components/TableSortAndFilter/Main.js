import TableSortAndFilter from './TableSortAndFilter';

class Main extends Component {
  constructor(props) {
    super(props);
    this.connectedTableSortAndFilter = this.props.stripes.connect(TableSortAndFilter);
    this.getTableData = this.getTableData.bind(this);
  }

  render () {
    const filterConfig = [
      {
        label: 'Transaction Type',
        name: 'transaction_type',
        cql: 'transaction_type',
        values: [
          {name: "PO-Line-Encumbrance", cql: false},
          {name: "Payment", cql: false},
          {name: "allocation", cql: false},
          {name: "Transfer", cql: false},
          {name: "credit", cql: false},
        ]
      }
    ];
    
    const visibleColumnsConfig = [
      { 'title': "id", 'status': true, },
      { 'title': "transaction_type", 'status': true, },
      { 'title': "allocated", 'status': true, },
      { 'title': "amount", 'status': true, },
      { 'title': "awaiting_payment", 'status': true, },
      { 'title': "encumbered", 'status': true, },
      { 'title': "expenditures", 'status': true, },
      { 'title': "note", 'status': true, },
      { 'title': "timestamp", 'status': true, },
      { 'title': "source_id", 'status': true, },
    ];

    const columnMapping = {
      id: 'ID',
      transaction_type: 'Transaction Type',
      allocated: 'Allocated',
      amount: 'Amount',
      awaiting_payment: 'Awaiting Payment',
      encumbered: 'Encumbered',
      expenditures: 'Expenditures',
      note: 'Note',
      timestamp: 'Timestamp',
      source_id: 'Source ID',
    };

    const formatter = {
      id: data => _.get(data, ['allocated'], ''),
      transaction_type: data => _.get('data', ['Transaction Type'], ''),
      allocated: data => _.get(data, ['allocated'], ''),
      amount: data => _.get('data', ['Amount'], ''),
      awaiting_payment: data => _.get('data', ['Awaiting Payment'], ''),
      encumbered: data => _.get('data', ['Encumbered'], ''),
      expenditures: data => _.get('data', ['Expenditures'], ''),
      note: data => _.get('data', ['Note'], ''),
      timestamp: data => _.get('data', ['timestamp'], ''),
      source_id: data => _.get('data', ['Source ID'], ''),
    };

    return (
      <this.connectedTableSortAndFilter
        paneWidth={'40%'}
        resourceName="tableRecords"
        heading="Transactions"
        stripes={this.props.stripes}
        filterConfig={filterConfig}
        visibleColumnsConfig={visibleColumnsConfig}
        contentData={this.getTableData()}
        columnMapping={columnMapping}
        onUpdateFilter={this.onUpdateFilter}
        parentResources={this.props.parentResources}
        parentMutator={this.props.parentMutator}
      />
    )
  }

  getTableData = () => {
    const { parentResources } = this.props;
    const data = (parentResources.tableRecords || {}).records || [];
    if (!data || data.length === 0) return [];
    return data;
  }
}
