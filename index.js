const mysql = require('mysql')
const express = require('express')
var app = express()
const bodyparser = require('body-parser')
// ===========================
const csv = require('csv-parser');
const fs = require('fs');
// ===========================
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'path/to/file.csv',
    header: [
        {id: 'name', title: 'NAME'},
        {id: 'lang', title: 'LANGUAGE'}
    ]
});
// ===========================



app.use(bodyparser.json())

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'davi2002',
    database: 'bancofuncionarios',
    multipleStatements: true
})



mysqlConnection.connect((err) => {
    if (!err)
        console.log('Conexão com o banco realizada.')
    else
        console.log('Conexão falhou. \n Error : ' + JSON.stringify(err, undefined, 2))
})


app.listen(3000, () => console.log('Servidor rodando na porta 3000'))


//Realizar GET em todos os funcionarios
app.get('/funcionarios', (req, res) => {
    mysqlConnection.query('SELECT * FROM funcionarios', (err, rows, fields) => {
        if (!err)
            res.send(rows)
        else
            console.log(err)
    })
})

//Realizar GET em todos os funcionarios e endereços
app.get('/funcionarios/endereco', (req, res) => {
    mysqlConnection.query('select * from funcionarios F inner join endereco E on F.id = E.idEndereco', (err, rows, fields) => {
        if (!err)
            res.send(rows)
        else
            console.log(err)
    })
})

//Realizar GET em funcionario com busca por ID
app.get('/funcionarios/endereco/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM funcionarios WHERE ID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows)
        else
            console.log(err)
    })
})

//Realizar DELETE em funcionario com busca por ID
app.delete('/funcionarios/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM funcionarios WHERE EmpID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Funcionario deletado.')
        else
            console.log(err)
    })
})





//Realizar INSERT de um novo funcionario
app.post('/funcionarios', (req, res) => {
    let emp = req.body
    var sql = "SET @id = ?SET @nome = ?SET @setor = ?SET @salario = ? \
    /* CALL EmployeeAddOrEdit */ INSERT INTO funcionarios (id, nome, setor, salario) VALUES (@id,@nome,@setor,@salario)"
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.setor, emp.Salary], (err, rows, fields) => {
        if (!err)
      /*       rows.forEach(element => {
                if(element.constructor == Array) */
                res.send('Funcionario inserido'/* +element[0].EmpID */)
            //})
        else
            res.send("Erro ao inserir funcionario.")
            console.log(err)
    })
})

//Realizar UPDATE de um funcionario
app.put('/funcionarios', (req, res) => {
    let emp = req.body
    var sql = "SET @ID = ?SET @nome = ?SET @setor = ?SET @salario = ? \
    /* CALL employeeAddOrEdit */ UPDATE funcionarios SET nome = @nome, setor = @setor, salario = @salario WHERE ID = @ID"
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.setor, emp.Salary], (err, rows, fields) => {
        if (!err)
            res.send('Funcionario atualizado.')
        else
            res.send("Erro ao atualizar funcionario.")
            console.log(err)
    })
})

// ===================================

const records = [
    {name: 'Joao',  lang: 'Portugues, Ingles'},
    {name: 'Pedro', lang: 'Portugues'}
];

csvWriter.writeRecords(records)       // returns a promise
    .then(() => {
        console.log('Feito');
    });
// ===================================
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('select * from funcionarios F inner join endereco E on F.id = E.idEndereco', (row) => {
    console.log(row);
  })
  .on('end', () => {
    console.log('arquivo CSV criado');
});