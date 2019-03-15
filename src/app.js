import CreateTable from './create-table.js';


export default (function () {
    // YOUR CODE GOES HERE
    // next line is for example only
    const app = document.getElementById("app")


    app.innerHTML = "<h1>Hello WG Forge</h1>";
    const table = new CreateTable();
    table.render(app)
    async function getOrders() {
        const response = await fetch('/api/orders.json')
        const json = await response.json();
        console.log(json)
        table.insertRows(json)
    }
    getOrders();


}());
