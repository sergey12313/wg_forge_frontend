function createTrow(parrent, title) {
  const data = '';
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
  parrent.appendChild(tr);
  return textNodeData;
}

// averageCheck: "714.13"
// averageCheckFemale: "714.13"
// averageCheckMale: "NaN"
// count: 222
// countFemale: 222
// countMale: 0
// median: "654.25"
// totalAll: "158535.95"
// totalFemale: "158535.95"
// totalMale: "0.00"


export default class Footer {
  constructor(data) {
    this.create();
    this.renderData(data);
  }

  create() {
    this.element = document.createElement('tfoot');
    const createTr = createTrow.bind(this, this.element);
    this.orderCount = createTr('Orders Count');
    this.ordersTotal = createTr('Orders Total');
    this.medianValue = createTr('Median Value');
    this.averageCheck = createTr('Average Check');
    this.averageCheckMale = createTr('Average Check (Male)');
    this.averageCheckFemale = createTr('Average Check (Female)');
  }

  renderData(data) {
    this.orderCount.data = data.count;
    this.ordersTotal.data = data.totalAll;
    this.medianValue.data = data.median;
    this.averageCheck.data = data.averageCheck;
    this.averageCheckMale.data = data.averageCheckMale;
    this.averageCheckFemale.data = data.averageCheckFemale;
  }
}
