import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Button from '@folio/stripes-components/lib/Button';
import stripesForm from '@folio/stripes-form';
// Components and Pages
import BudgetForm from './BudgetForm';

class BudgetPane extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.getFiscalYears = this.getFiscalYears.bind(this);
    this.deleteBudget = this.deleteBudget.bind(this);
  }

  getAddFirstMenu() {
    const { onCancel } = this.props;
    return (
      <PaneMenu>
        <button type="button" id="clickable-closenewbudgetdialog" onClick={onCancel} title="close" aria-label="Close New Budget Dialog">
          <span style={{ fontSize: '30px', color: '#999', lineHeight: '18px' }}>&times;</span>
        </button>
      </PaneMenu>
    );
  }

  getLastMenu(id, label) {
    const { pristine, submitting, handleSubmit } = this.props;
    return (
      <PaneMenu>
        <Button
          id={id}
          type="submit"
          title={label}
          disabled={pristine || submitting}
          onClick={handleSubmit}
          style={{ marginBottom: '0' }}
        >
          {label}
        </Button>
      </PaneMenu>
    );
  }

  getFiscalYears() {
    const newArr = [];
    const fiscalRecords = (this.props.parentResources || {}).fiscalyear.records || [];
    const arrLength = fiscalRecords.length - 1;
    if (fiscalRecords != null) {
      Object.keys(fiscalRecords).map((key) => {
        const name = `Code: ${fiscalRecords[key].code}, Name:${fiscalRecords[key].name}`;
        const val = fiscalRecords[key].id;
        newArr.push({
          label: name.toString(),
          value: val.toString()
        });
        if (Number(key) === arrLength) {
          return newArr;
        }
        return newArr;
      });
    }
    return newArr;
  }

  deleteBudget(ID) {
    const { parentMutator } = this.props;
    parentMutator.records.DELETE({ id: ID }).then(() => {
      parentMutator.query.update({
        _path: '/finance/budget',
        layer: null
      });
    });
  }

  render() {
    const { initialValues } = this.props;
    const firstMenu = this.getAddFirstMenu();
    const paneTitle = initialValues.id ? (
      <span>
        {`Edit: ${_.get(initialValues, ['name'], '')}`}
      </span>
    ) : 'Create budget';
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-updatebudget', 'Update budget') :
      this.getLastMenu('clickable-createnewbudget', 'Create budget');
    return (
      <form id="form-budget">
        <Pane defaultWidth="100%" firstMenu={firstMenu} lastMenu={lastMenu} paneTitle={paneTitle}>
          <BudgetForm {...this.props} deleteBudget={this.deleteBudget} />
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'BudgetPane',
  // validate,
  // asyncValidate,
  navigationCheck: true,
  enableReinitialize: true,
})(BudgetPane);
