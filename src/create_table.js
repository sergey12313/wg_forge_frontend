import Row from './create_row';

const headerInfo = [
  {
    name: 'Transaction ID',
    dbName: 'transaction_id',
  },
  {
    name: 'User Info',
    dbName: 'user_id',
  },
  {
    name: 'Order Date',
    dbName: 'created_at',
  },
  {
    name: 'Order Amount',
    dbName: 'total',
  },
  {
    name: 'Card Number',
    dbName: 'card_number',
  },
  {
    name: 'Card Type',
    dbName: 'card_type',
  },
  {
    name: 'Location',
    dbName: 'order_country',
  },

];


export default class CreateTable {
  constructor(data, app) {
    this.prepareData(data);
    this.app = app;
    this.table = document.createElement('table');
    this.createTableContentBlocks();
    this.writeHeaderBlock();
    this.createRows();
    this.renderRows();
    this.writeStatisticBlock();
    this.calculateStatistics();
    this.addListeners();
  }

  createTableContentBlocks() {
    this.header = this.table.createTHead();
    this.tbody = this.table.createTBody();
    this.footer = this.table.createTFoot();
  }

  prepareData(data) {
    const users = data.users.reduce((acc, element) => {
      acc[element.id] = element;
      return acc;
    }, {});
    const companies = data.companies.reduce((acc, element) => {
      acc[element.id] = element;
      return acc;
    }, {});
    const { orders } = data;
    this.orders = orders.map((element) => {
      const order = { ...element };
      const userId = order.user_id;
      order.userInfo = users[userId];
      order.userInfo.companyInfo = null;
      const { company_id: companyId } = order.userInfo;
      if (companyId && companies[companyId]) {
        order.userInfo.companyInfo = companies[companyId];
      }
      return order;
    });
  }

  calculateStatistics() {
    const { rows } = this;


    const statistics = rows.reduce((acc, element) => {
      const total = Number(element.order.total) * 100;
      if (element.order.userInfo.gender === 'Male') {
        acc.totalMale += total;
        acc.countMale += 1;
      }
      acc.totalAll += total;
      return acc;
    }, { totalMale: 0, countMale: 0, totalAll: 0 });
    statistics.count = rows.length;
    statistics.countFemale = statistics.count - statistics.countMale;
    statistics.totalFemale = ((statistics.totalAll - statistics.totalMale) / 100).toFixed(2);
    statistics.totalMale = (statistics.totalMale / 100).toFixed(2);
    statistics.totalAll = (statistics.totalAll / 100).toFixed(2);
    statistics.averageCheck = (statistics.totalAll / statistics.count).toFixed(2);
    statistics.averageCheckMale = (statistics.totalMale / statistics.countMale).toFixed(2);
    statistics.averageCheckFemale = (statistics.totalFemale / statistics.countFemale).toFixed(2);
    const calcMedian = (ordersChecks) => {
      const ordersAmounts = ordersChecks.map(elem => Math.trunc((Number(elem.order.total)) * 100));
      ordersAmounts.sort((a, b) => a - b);
      let median;
      const { length } = ordersAmounts;

      const middle = length / 2;

      if (length % 2 === 0) {
        median = (ordersAmounts[middle] + ordersAmounts[middle + 1]) / 2;
      } else {
        median = ordersAmounts[Math.ceil(middle)];
      }
      return median;
    };
    statistics.median = ((calcMedian(rows)) / 100).toFixed(2);
  }


  writeStatisticBlock() {
    const createTr = (title, data) => {
      const tr = document.createElement('tr');
      const textNodeTitle = document.createTextNode(title);
      const textNodeData = document.createTextNode(data);
      const tdSpan = document.createElement('td');
      tdSpan.colSpan = 5;
      const tdTitle = document.createElement('td');
      const tdData = document.createElement('td');
      tdTitle.appendChild(textNodeTitle);
      tdData.appendChild(textNodeData);
      tr.appendChild(tdSpan);
      tr.appendChild(tdTitle);
      tr.appendChild(tdData);
      return tr;
    };
    const { rows } = this;


    this.footer.appendChild(createTr('Orders Count:', rows.length));
  }

  addListeners() {
    this.table.addEventListener('click', (event) => {
      const { target } = event;
      if (target.getAttribute('data-action') === 'toggle') {
        event.preventDefault();
        event.target.parentElement.querySelector('.user-details').classList.toggle('user-details--hiden');
      }
    });
  }

  render() {
    this.app.appendChild(this.table);
  }

  writeHeaderBlock() {
    const row = document.createElement('tr');
    headerInfo.forEach(({ name }) => {
      const th = document.createElement('th');
      th.textContent = name;
      row.appendChild(th);
    });
    this.header.appendChild(row);
  }

  createRows() {
    this.rows = this.orders.map(order => new Row(order));
  }

  renderRows() {
    this.tbody.append(...(this.rows.map(({ element }) => element)));
  }
}
