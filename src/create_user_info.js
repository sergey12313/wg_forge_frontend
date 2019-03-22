const createLink = function createLink(text, href = '#') {
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.appendChild(document.createTextNode(text));
  return a;
};

export default class UserInfo {
  constructor(userInfo) {
    this.userInfo = userInfo;
    this.element = this.createElement();
  }

  get fullName() {
    return `${(this.userInfo.userGender === 'Male') ? 'Mr.' : 'Ms.'
    } ${this.userInfo.userFirstName} ${this.userInfo.userLastName} `;
  }

  get formatedBirthday() {
    const { userBirthday } = this.userInfo;
    if (!userBirthday) {
      return 'N/a';
    }
    const date = new Date(userBirthday * 1000);
    const formatter = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    return formatter.format(date);
  }


  createInfoDiv() {
    const div = document.createElement('div');
    div.classList.add('user-details', 'user-details--hiden');
    const birthday = document.createElement('p');
    birthday.appendChild(document.createTextNode(`Birthday: ${this.formatedBirthday}`));
    div.appendChild(birthday);
    if (this.userInfo.userAvatar) {
      const avatar = document.createElement('p');
      const img = document.createElement('img');
      img.width = '100';
      img.src = this.userInfo.userAvatar;
      avatar.appendChild(img);
      div.appendChild(avatar);
    }

    const company = document.createElement('p');
    company.appendChild(document.createTextNode('Company: '));
    const { userCompanyId } = this.userInfo;
    if (userCompanyId) {
      const a = createLink(this.userInfo.companyTitle, this.userInfo.companyUrl);
      company.appendChild(a);
      const industry = document.createElement('p');
      industry.appendChild(document.createTextNode(`Industry: ${this.userInfo.companyIndustry}`));
      company.appendChild(industry);
    } else {
      company.appendChild(document.createTextNode('N/a'));
    }
    div.appendChild(company);
    return div;
  }

  createElement() {
    const td = document.createElement('td');
    td.classList.add('user-data');
    const toggleLink = createLink(this.fullName);
    toggleLink.dataset.action = 'toggle';
    td.appendChild(toggleLink);
    td.appendChild(this.createInfoDiv());
    return td;
  }
}
