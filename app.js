const express = require('express')//подлючение фреймворка Express
const config = require('config')//подключение конфига(npm config)
const mongoose = require('mongoose')//подключение базы данных mongoDB
const path = require('path')//для работы с путями

const app = express()

app.use(express.json({ extended: true }))//midlevare для корректного парсинга полей email и password в body auth.routes
app.use('/api/auth', require('./routes/auth.routes'))//добовляем маршрутизацию из папки routes для AuthPage
app.use('/api/link', require('./routes/link.routes'))//добавляем маршрутизацию из папки routes для LinksPage
app.use('/t', require('./routes/redirect.routes'))//маршрутизация для перехода по сокращенной ссылке

//добавляем запуск статики для production после сборки "build"
if(process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}


const PORT = config.get('port') || 5000// вызов порта из папки config
//подключение базы данных(mongo DB) и запуск сервера
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

