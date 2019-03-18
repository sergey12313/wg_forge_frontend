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

]






export default class CreateTable {
    constructor(data, app) {
        this.prepareData(data)
        this.app = app;
        this.table = document.createElement('table');
        this.createTableContentBlocks()
        this.writeHeaderBlock()
        this.createRows();
        this.renderRows();
        this.writeStatisticBlock();
        this.addListeners()
        this.render();

    }
    createTableContentBlocks() {
        this.header = this.table.createTHead()
        this.tbody = this.table.createTBody()
        this.footer = this.table.createTFoot()
    }
    prepareData(data) {
        const users = data.users.reduce((acc, element) => {
            acc[element.id] = element;
            return acc;
        }, {})
        const companies = data.companies.reduce((acc, element) => {
            acc[element.id] = element;
            return acc;
        }, {})
        const { orders } = data;
        this.orders = orders.map((order) => {
            const userId = order.user_id;
            order.userInfo = users[userId];
            order.userInfo['companyInfo'] = null;
            const company_id = order.userInfo.company_id
            if (company_id && companies[company_id]) {
                order.userInfo.companyInfo = companies[company_id]
            }
            return order

        })
    }
    writeStatisticBlock() {
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


        // const ordersTotals = rows.reduce((acc, element) => {
        //     const total = Number(element.total) * 100;
        //     if (element.userInfoBlock.userInfo.gender === 'Male') {
        //         acc.totalMale += total;
        //         acc.countMale += 1
        //     }
        //     return acc;

        // }, stats);

        this.footer.appendChild(createTr('Orders Count:', rows.length))

    }
    addListeners() {
        this.table.addEventListener('click', (event) => {
            const target = event.target;
            if (target.getAttribute('data-action') === 'toggle') {
                event.preventDefault()
                event.target.parentElement.querySelector('.user-details').classList.toggle('user-details--hiden')
            }
        })
    }
    render() {
        this.app.appendChild(this.table)
    }

    writeHeaderBlock() {
        const row = document.createElement('tr')
        headerInfo.forEach(({ name }) => {
            const th = document.createElement('th')
            th.textContent = name;
            row.appendChild(th)
        })
        this.header.appendChild(row)
    }
    createRows() {
        this.rows = this.orders.map(order => {
            return new Row(order)
        })

    }
    renderRows() {
        this.tbody.append(...(this.rows.map(({ element }) => element)))
    }
}