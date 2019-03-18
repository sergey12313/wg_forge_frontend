import UserInfo from './create_user_info';

export default class Row {
  constructor(order) {
    this.order = order;
    this.element = this.createElement(new UserInfo(order.userInfo));
  }

  get orderDataFormated() {
    const date = new Date(this.order.created_at * 1000);
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
  }

  get orderAmount() {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.order.total);
  }

  get cardNumberHiden() {
    const cardNumber = this.order.card_number;
    const astLength = cardNumber.length - 6;
    return `${cardNumber.slice(0, 2)} ${'*'.repeat(astLength)} ${cardNumber.slice(-4)}`;
  }

  get location() {
    return `${this.order.order_country} (${this.order.order_ip})`;
  }

  createElement(userInfoBlock) {
    const { id, transaction_id: transactionId, card_type: cardType } = this.order;
    const row = document.createElement('tr');
    row.id = `order_${id} `;
    function createTd(text) {
      const td = document.createElement('td');
      td.textContent = text;
      return td;
    }
    row.appendChild(createTd(transactionId));
    row.appendChild(userInfoBlock.element);
    row.appendChild(createTd(this.orderDataFormated));
    row.appendChild(createTd(this.orderAmount));
    row.appendChild(createTd(this.cardNumberHiden));
    row.appendChild(createTd(cardType));
    row.appendChild(createTd(this.location));
    return row;
  }
}
