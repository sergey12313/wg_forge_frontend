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

class Row {
    constructor(data) {
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
        return `${this.card_number.slice(0, 2)}${'*'.repeat(astLength)}${this.card_number.slice(-4)}`
    }
    get location() {
        return `${this.order_country}(${this.order_ip})`
    }

    render() {
        const row = document.createElement('tr')
        row.id = `order_${this.id}`;
        function createTd(text) {
            const td = document.createElement('td')
            td.textContent = text;
            return td;
        }

        row.appendChild(createTd(this.transaction_id))
        row.appendChild(createTd(this.user_id))
        row.appendChild(createTd(this.orderDataFormated))
        row.appendChild(createTd(this.orderAmount))
        row.appendChild(createTd(this.card_numberHiden))
        row.appendChild(createTd(this.card_type))
        row.appendChild(createTd(this.location))
        return row
    }

}




export default class CreateTable {
    constructor() {
        this.table = document.createElement('table');
        this.header = this.table.createTHead()
        this.tableWriteHead()
        this.tbody = this.table.createTBody()
    }
    render(selector) {
        selector.appendChild(this.table)
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

    insertRows(rows) {
        rows.forEach(row => {
            this.tbody.appendChild(new Row(row).render())
        })

    }
}