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
        order: 4,
    },
    {
        name: 'Card Type',
        dbName: 'card_type',
    },
    {
        name: 'Location',
        dbName: 'order_country',
    },

]

class UserInfo {
    constructor(userInfo, companyInfo) {
        this.userInfo = userInfo;
        this.companyInfo = companyInfo;
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
        a.textContent = text;
        return a;
    }
    createInfoDiv() {
        const div = document.createElement('div');
        div.classList.add('user-details', 'user-details--hiden')
        const birthday = document.createElement('p');
        birthday.textContent = `Birthday: ${this.formatedBirthday}`
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
            const a = this.createLink(this.companyInfo.title, this.companyInfo.url)
            a.target = '_blank'
            company.appendChild(a)
            const industry = document.createElement('p');
            industry.appendChild(document.createTextNode(`Industry: ${this.companyInfo.industry}`))
            company.appendChild(industry)
        } else {
            company.appendChild(document.createTextNode('N/a'))
        }
        div.appendChild(company);
        return div
    }
    getElement() {
        const td = document.createElement('td');
        td.classList.add('user-data');
        const toggleLink = this.createLink(this.fullName);
        toggleLink.dataset.action = 'toggle'
        td.appendChild(toggleLink)
        td.appendChild(this.createInfoDiv())
        return td;
    }
}

class Row {
    constructor(data, userInfo = {}, companyInfo = {}) {
        this.userInfoBlock = new UserInfo(userInfo, companyInfo);
        this.id = data.id;
        this.transaction_id = data.transaction_id;
        this.user_id = data.user_id;
        this.created_at = data.created_at;
        this.total = data.total;
        this.card_number = data.card_number;
        this.card_type = data.card_type;
        this.order_country = data.order_country;
        this.order_ip = data.order_ip;
    }
    get orderDataFormated() {

        const date = new Date(this.created_at * 1000);
        const options = {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        }
        var formatter = new Intl.DateTimeFormat("en-US", options)
        return formatter.format(date);
    }
    get orderAmount() {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.total)
    }
    get card_numberHiden() {
        const astLength = this.card_number.length - 6;
        return `${this.card_number.slice(0, 2)} ${'*'.repeat(astLength)} ${this.card_number.slice(-4)} `
    }
    get location() {
        return `${this.order_country} (${this.order_ip})`
    }
    get element() {
        const row = document.createElement('tr')
        row.id = `order_${this.id} `;
        function createTd(text) {
            const td = document.createElement('td')
            td.textContent = text;
            return td;
        }
        row.appendChild(createTd(this.transaction_id))
        row.appendChild(this.userInfoBlock.getElement())
        row.appendChild(createTd(this.orderDataFormated))
        row.appendChild(createTd(this.orderAmount))
        row.appendChild(createTd(this.card_numberHiden))
        row.appendChild(createTd(this.card_type))
        row.appendChild(createTd(this.location))
        return row
    }


}




export default class CreateTable {
    constructor(data) {
        this.data = data;
        this.table = document.createElement('table');
        this.header = this.table.createTHead()
        this.tbody = this.table.createTBody()
        this.footer = this.table.createTFoot()
        this.tableWriteHead()

        this.createRows();
        this.renderRows();
        this.renderStatistics();
        this.addListener()
        this.render();

    }

    renderStatistics() {
        const createTr = (title, data) => {
            const tr = document.createElement('tr');
            const textNodeTitle = document.createTextNode(title);
            const textNodeData = document.createTextNode(data);
            const tdSpan = document.createElement('td');
            tdSpan.colSpan = 5
            const tdTitle = document.createElement('td');
            const tdData = document.createElement('td');
            tdTitle.appendChild(textNodeTitle);
            tdData.appendChild(textNodeData);
            tr.appendChild(tdSpan);
            tr.appendChild(tdTitle);
            tr.appendChild(tdData);
            return tr
        }
        const rows = this.rows;

        const stats = {
            countMale: 0,
            get countAll() {
                rows.length
            },
            get countFemale() {
                this.countAll - this.countMale;
            }

        }


        const ordersTotals = rows.reduce((acc, element) => {
            const total = Number(element.total) * 100;
            if (element.userInfoBlock.userInfo.gender === 'Male') {
                acc.totalMale += total;
                acc.countMale += 1
            }
            return acc;

        }, stats);
        console.log(ordersTotals)
        this.footer.appendChild(createTr('Orders Count:', rows.length))

    }
    addListener() {
        this.table.addEventListener('click', (event) => {
            const target = event.target;
            if (target.getAttribute('data-action') === 'toggle') {
                event.preventDefault()
                event.target.parentElement.querySelector('.user-details').classList.toggle('user-details--hiden')
            }
        })
    }
    render() {
        this.data.app.appendChild(this.table)
    }

    tableWriteHead() {
        const row = document.createElement('tr')
        headerInfo.forEach(({ name }) => {
            const th = document.createElement('th')
            th.textContent = name;
            row.appendChild(th)
        })
        this.header.appendChild(row)
    }
    createRows() {
        const users = this.data.users.reduce((acc, element) => {
            acc[element.id] = element;
            return acc;
        }, {})
        const companies = this.data.companies.reduce((acc, element) => {
            acc[element.id] = element;
            return acc;
        }, {})
        this.rows = this.data.orders.map(order => {
            const userInfo = users[order['user_id']];
            if (!userInfo) {
                return new Row(order)
            } else if (!userInfo.company_id) {
                return new Row(order, userInfo)
            } else {
                const companyInfo = companies[userInfo['company_id']];
                console.log(companyInfo)
                if (!companyInfo) {
                    return new Row(order, userInfo)
                }
                return new Row(order, userInfo, companyInfo)
            }


        })

    }
    renderRows() {
        this.tbody.append(...(this.rows.map(({ element }) => element)))
    }
}