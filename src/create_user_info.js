export default class UserInfo {
    constructor(userInfo) {
        this.userInfo = userInfo;
        this.element = this.createElement();
    }
    get fullName() {
        return `${(this.userInfo.gender === 'Male') ? 'Mr.' : 'Ms.'
            } ${this.userInfo.first_name} ${this.userInfo.last_name} `
    }
    get formatedBirthday() {
        const birthday = this.userInfo.birthday
        if (!birthday) {
            return 'N/a'
        }
        const date = new Date(birthday * 1000);
        var formatter = new Intl.DateTimeFormat("en-US", {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        })
        return formatter.format(date);
    }
    createLink(text, href = '#') {
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank'
        a.appendChild(document.createTextNode(text))
        return a;
    }
    createInfoDiv() {
        const div = document.createElement('div');
        div.classList.add('user-details', 'user-details--hiden')
        const birthday = document.createElement('p');
        birthday.appendChild(document.createTextNode(`Birthday: ${this.formatedBirthday}`))
        div.appendChild(birthday);
        if (this.userInfo.avatar) {
            const avatar = document.createElement('p');
            const img = document.createElement('img');
            img.width = '100'
            img.src = this.userInfo.avatar;
            avatar.appendChild(img)
            div.appendChild(avatar);
        }

        const company = document.createElement('p');
        company.appendChild(document.createTextNode('Company: '))
        const company_id = this.userInfo.company_id;
        if (company_id) {
            const companyInfo = this.userInfo.companyInfo;
            const a = this.createLink(companyInfo.title, companyInfo.url)
            company.appendChild(a)
            const industry = document.createElement('p');
            industry.appendChild(document.createTextNode(`Industry: ${companyInfo.industry}`))
            company.appendChild(industry)
        } else {
            company.appendChild(document.createTextNode('N/a'))
        }
        div.appendChild(company);
        return div
    }
    createElement() {
        const td = document.createElement('td');
        td.classList.add('user-data');
        const toggleLink = this.createLink(this.fullName);
        toggleLink.dataset.action = 'toggle'
        td.appendChild(toggleLink)
        td.appendChild(this.createInfoDiv())
        return td;
    }
}
