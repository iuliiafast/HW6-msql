import express from 'express';
import connection from './db.js';

const app = express();
const port = 3000;

app.use(express.json());

/*app.get('/', (req, res) => {
  res.status(200).send('Hello, World!');
});

app.post('/', (req, res) => {
  const data = req.body?.data;

  if (!data) {
    return res.status(400).json({ error: 'Нет данных в запросе' });
  }

  res.status(200).json({ message: 'POST-запрос обработан', data });
});
*/
app.get('/products', (req, res) => {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка получения данных' });
    }
    res.status(200).json(results);
  });
});

// Маршрут POST /products
app.post('/products', (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Необходимы имя и цена' });
  }

  const query = 'INSERT INTO products (name, price) VALUES (?, ?)';
  connection.query(query, [name, price], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка добавления продукта' });
    }
    res.status(201).json({ message: 'Продукт добавлен успешно' });
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то пошло не так!');
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
