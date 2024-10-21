const express = require('express')

const mysql = require('mysql')

const bodyparser = require('body-parser')

const app = express()

const connection = mysql.createConnection({
  host: 'localhost', // 数据库服务器地址
  user: 'root', // 数据库用户名
  password: '123456', // 数据库密码
  database: 'contacts' // 要连接的数据库名
})

connection.connect()

app.use(express.static('pages'))
app.use(bodyparser.json())

app.get('/', (req, res) => {
  // 假设你的HTML文件名为index.html，位于public目录下
  res.sendFile(__dirname + '/pages/index.html')
})

app.post('/add', (req, res) => {
  let info = req.body
  console.log(info)
  const query =
    'INSERT INTO contacts (name, phone, email, address) VALUES (?, ?, ?, ?)'
  let values = [info.name, info.phone, info.email, info.address]
  connection.query(query, values, function (error, results, fields) {
    if (error) throw error
    // 成功后的操作，例如输出结果
    console.log('Row inserted: ', results)
    res.send('ok')
  })
})

app.get('/contacts', (req, res) => {
  connection.query('SELECT * FROM contacts', (error, results, fields) => {
    if (error) throw error
    // 发送数据给前端
    res.json(results)
  })
})

app.post('/del', (req, res) => {
  let id = req.body.id
  const deleteSql = `DELETE FROM contacts WHERE id = ?`

  // 执行删除操作
  connection.query(deleteSql, [id], (error, results, fields) => {
    if (error) {
      // 处理错误
      console.error('删除数据时出错:', error.message)
      return
    }

    // 删除成功
    console.log('数据删除成功，影响行数:', results.affectedRows)
    res.send('ok')
  })
})

app.post('/edit', (req, res) => {
  let info = req.body
  const updateQuery =
    'UPDATE contacts SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?'
  newData = [info.name, info.phone, info.email, info.address, info.id]
  connection.query(updateQuery, newData, function (error, results, fields) {
    if (error) throw error
    // 更新成功的处理逻辑
    console.log('Row updated successfully')
    res.send('ok')
  })
})

app.listen(5000, () => {
  console.log('服务在http://127.0.0.1:5000/ 启动')
})
