import Row from './create_row';

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
      const userInfo = {
        userBirthday: element.birthday,
        userCompanyId: element.company_id,
        userFirstName: element.first_name,
        userGender: element.gender,
        userAvatar: element.avatar,
        userLastName: element.last_name,
      };
      acc[element.id] = userInfo;
      return acc;
    }, {});
    const companies = data.companies.reduce((acc, element) => {
      const companyInfo = {
        companyTitle: element.title,
        companyIndustry: element.industry,
        companyUrl: element.url,
      };
      acc[element.id] = companyInfo;
      return acc;
    }, {});
    const { orders } = data;

    this.orders = orders.map((element) => {
      const orderInfo = {
        id: element.id,
        userId: element.user_id,
        cardNumber: element.card_number,
        cardType: element.card_type,
        createdAt: element.created_at,
        transactionId: element.transaction_id,
        orderIp: element.order_ip,
        total: element.total,
        country: element.order_country,
      };

      const userId = element.user_id;
      const userInfo = users[userId] || {};
      const { userCompanyId } = userInfo;
      const companyInfo = (userCompanyId && companies[userCompanyId])
        ? companies[userCompanyId]
        : {};
      const order = { ...orderInfo, ...userInfo, ...companyInfo };
      return order;
    });
  }

  calculateStatistics() {
    const { rows } = this;
    const statistics = rows.reduce((acc, element) => {
      const total = Number(element.data.total) * 100;
      if (element.data.gender === 'Male') {
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
      const ordersAmounts = ordersChecks.map(elem => Math.trunc((Number(elem.data.total)) * 100));
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

  makeSort(target) {
    const index = [...target.parentNode.cells].indexOf(target);
    const collator = new Intl.Collator(['en'], { numeric: true });
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
    const row = document.createElement('tr');
    headerTitle.forEach((name, index) => {
      const th = document.createElement('th');
      if (index !== 4) th.classList.add('sortable');
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
