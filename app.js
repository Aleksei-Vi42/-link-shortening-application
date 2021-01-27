const express = require('express')//подлючение фреймворка Express
const config = require('config')//подключение конфига(npm config)
const mongoose = require('mongoose')//подключение базы данных mongoDB


const app = express()

app.use(express.json({ extended: true }))//midlevare для корректного парсинга полей email и password в body auth.routes

app.use('/api/auth', require('./routes/auth.routes'))//добовляем маршрутизацию из папки routes для AuthPage

app.use('/api/link', require('./routes/link.routes'))//добавляем маршрутизацию из папки routes для LinksPage

const PORT = config.get('port') || 5000// вызов порта из папки config

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1) //ззавершение процесса при возникновении ошибки
  }
console.log(PORT)
}
start()

