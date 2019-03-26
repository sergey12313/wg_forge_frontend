import Row from './create_row';
import Footer from './footer';
import calcStatistics from './utils/calculate-statistics';


const headerTitle = [
  'Transaction ID',
  'User Info',
  'Order Date',
  'Order Amount',
  'Card Number',
  'Card Type',
  'Location',
];


export default class CreateTable {
  constructor(data, app) {
    // this.allOrders = data;
    this.app = app;
    this.rows = data.map(order => new Row(order));

    // this.filtredOrders = [...this.allOrders].slice(221);
    this.statistics = calcStatistics(this.rows);

    this.table = document.createElement('table');
    this.header = this.table.createTHead();
    this.tbody = this.table.createTBody();
    this.writeHeaderBlock();
    // this.createRows();
    this.renderRows();
    this.footer = new Footer(this.statistics);
    this.table.appendChild(this.footer.element);
    this.addListeners();
  }


  makeSort(target) {
    const index = [...target.parentNode.cells].indexOf(target);
    const collator = new Intl.Collator(['en'], { numeric: true });
    for (const cell of target.parentNode.cells) { // eslint-disable-line no-restricted-syntax
      cell.classList.toggle('sortable--sorted', cell === target);
    }

    const comparator = param => (a, b) => collator.compare(a.data[param], b.data[param]);

    const sortByName = () => {
      if (!target.hasAttribute('data-order') || target.getAttribute('data-order') === 'last') {
        target.setAttribute('data-order', 'first');
        return comparator('userFirstName');
      }
      target.setAttribute('data-order', 'last');
      return comparator('userLastName');
    };

    const sortByLocation = () => {
      if (!target.hasAttribute('data-order') || target.getAttribute('data-order') === 'country') {
        target.setAttribute('data-order', 'ip');
        return comparator('country');
      }
      target.setAttribute('data-order', 'country');
      return comparator('orderIp');
    };
    let rerender = true;
    switch (index) {
      case 0:
        this.rows.sort(comparator('transactionId'));
        break;
      case 1:
        this.rows.sort(sortByName());
        break;
      case 2:
        this.rows.sort(comparator('createdAt'));
        break;
      case 3:
        this.rows.sort(comparator('total'));
        break;
      case 5:
        this.rows.sort(comparator('cardType'));
        break;
      case 6:
        this.rows.sort(sortByLocation());
        break;
      default:
        rerender = false;
        break;
    }
    if (rerender) {
      this.renderRows();
    }
  }

  addListeners() {
    this.searchForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = event.target.lastElementChild;
      const regexp = new RegExp(`${input.value}`, 'i');

      this.rows.forEach((element) => {
        const { data } = element;
        if (input.value.trim() === '') {
          element.setVisible(true);
        } else if (data.transactionId.match(regexp)) {
          element.setVisible(true);
        } else if (data.userLastName.match(regexp)) {
          element.setVisible(true);
        } else if (data.userFirstName.match(regexp)) {
          element.setVisible(true);
        } else if (data.cardType.match(regexp)) {
          element.setVisible(true);
        } else if (data.orderIp.match(regexp)) {
          element.setVisible(true);
        } else if (data.total.match(regexp)) {
          element.setVisible(true);
        } else if (data.country.match(regexp)) {
          element.setVisible(true);
        } else {
          element.setVisible(false);
        }
      });
      const st = calcStatistics(this.rows);
      console.log(st);
      this.footer.renderData(calcStatistics(this.rows));
    });

    this.table.addEventListener('click', (event) => {
      const { target } = event;
      if (target.getAttribute('data-action') === 'toggle') {
        event.preventDefault();
        event.target.parentElement.querySelector('.user-details').classList.toggle('user-details--hiden');
      }
      if (target.matches('thead tr th.sortable')) {
        this.makeSort(target);
      }
    });
  }

  render() {
    this.app.appendChild(this.table);
  }

  writeHeaderBlock() {
    const searchRow = document.createElement('tr');
    const colSpanTh = document.createElement('th');
    colSpanTh.colSpan = 6;
    const thSearch = document.createElement('th');
    const form = document.createElement('form');

    this.searchForm = form;
    const label = document.createElement('label');
    label.textContent = 'Search:';
    label.setAttribute('for', 'search-input');
    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('id', 'search-input');
    form.appendChild(label);
    form.appendChild(searchInput);
    thSearch.appendChild(form);
    searchRow.appendChild(colSpanTh);
    searchRow.appendChild(thSearch);
    this.header.appendChild(searchRow);
    const row = document.createElement('tr');
    headerTitle.forEach((name, index) => {
      const th = document.createElement('th');
      if (index !== 4) th.classList.add('sortable');
      th.textContent = name;
      row.appendChild(th);
    });
    this.header.appendChild(row);
  }

  //   createRows() {
  //     console.log(this.filtredOrders);
  //     this.rows = this.filtredOrders.map(order => new Row(order));
  //   }

  renderRows() {
    this.tbody.append(...(this.rows.map(({ element }) => element)));
  }
}
