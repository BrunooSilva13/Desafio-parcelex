const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'db',
    user: 'admin',
    password: 'root',
    database: 'usersdb'
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');

    
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS usersdb (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            original_link VARCHAR(255),
            short_link VARCHAR(255),
            created_at TIMESTAMP DEFAULT,
        )
    `;
    db.query(createUsersTableQuery, (err, result) => {
        if (err) {
            console.error('Erro ao criar tabela users:', err);
            return;
        }
        console.log('Tabela users verificada/criada com sucesso');
    });
});


app.post('/users', (req, res) => {
    const { name, email, original_link } = req.body;
    const query = 'INSERT INTO usersdb (name, email, original_link) VALUES (?, ?, ?)';
    db.query(query, [name, email, original_link], (err, result) => {
        if (err) {
            console.error('Erro ao criar usuário:', err);
            res.status(500).send('Erro ao criar usuário');
            return;
        }
        res.status(201).send('Usuário criado com sucesso');
    });
});


app.get('/users', (req, res) => {
    const query = 'SELECT * FROM usersdb';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao obter usuários:', err);
            res.status(500).send('Erro ao obter usuários');
            return;
        }
        res.json(results);
    });
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM usersdb WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao obter usuário:', err);
            res.status(500).send('Erro ao obter usuário');
            return;
        }
        res.json(results[0]);
    });
});


app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, original_link } = req.body;
    const query = 'UPDATE usersdb SET name = ?, email = ?, original_link WHERE id = ?';
    db.query(query, [name, email, original_link, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar usuário:', err);
            res.status(500).send('Erro ao atualizar usuário');
            return;
        }
        res.send('Usuário atualizado com sucesso');
    });
});





app.get('/', (req, res) => {
    res.send('Servidor Node.js está funcionando!');
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
