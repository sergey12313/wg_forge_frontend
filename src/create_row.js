import UserInfo from './create_user_info';

export default class Row {
  constructor(data) {
    this.data = data;
    this.display = true;
    this.element = this.createElement(new UserInfo({
      userGender: data.userGender,
      userBirthday: data.userBirthday,
      userAvatar: data.userAvatar,
      userLastName: data.userLastName,
      companyTitle: data.companyTitle,
      userFirstName: data.userFirstName,
      userCompanyId: data.userCompanyId,
      companyUrl: data.companyUrl,
      companyIndustry: data.companyIndustry,
    }));
  }

  setVisible(value) {
    if (value === true) {
      this.element.style.display = 'table-row';
    } else {
      this.element.style.display = 'none';
    }
    this.display = value;
  }


  get orderDataFormated() {
    const date = new Date(this.data.createdAt * 1000);
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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.data.total);
  }

  get cardNumberHiden() {
    const { cardNumber } = this.data;
    const astLength = cardNumber.length - 6;
    return `${cardNumber.slice(0, 2)} ${'*'.repeat(astLength)} ${cardNumber.slice(-4)}`;
  }

  get location() {
    return `${this.data.country} (${this.data.orderIp})`;
  }

  createElement(userInfoBlock) {
    const { id, transactionId, cardType } = this.data;
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
