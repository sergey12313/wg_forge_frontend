// import CreateTable from './create-table.js';
import CreateTable from './create_table.js';


export default (function def() {
  // YOUR CODE GOES HERE
  // next line is for example only
  const app = document.getElementById('app');
  const spiner = document.querySelector('.preloader');

  app.innerHTML = '<h1>Hello WG Forge</h1>';
  // const table = new CreateTable();
  // table.render(app)
  async function renderTable() {
    const [orders, users, companies] = await Promise.all([
      fetch('/api/orders.json').then(response => response.json()),
      fetch('/api/users.json').then(response => response.json()),
      fetch('/api/companies.json').then(response => response.json()),
    ]);
    spiner.classList.toggle('preloader--hiden', true);
    const table = new CreateTable({ orders, users, companies }, app);
    table.render();
  }
  renderTable();
}());
