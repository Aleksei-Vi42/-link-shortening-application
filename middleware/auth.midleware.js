//middleware для  расскодировки токена(что бы извлечь поле userId)для link.routes
const jwt = require('jsonwebtoken')//для метода verify
const config = require('config')

module.exports = (req, res, next) => {
//базовая проверка доступности сервера
    if (req.method === 'OPTIONS') {
      return next()
    }
//извлекаем токен
   try{
      //распарсиваем поле "authorization"(Bearer TOKEN) получая от туда массив с TOKEN
      const token = req.headers.authorization.split(' ')[1]
      if(!token) {
        return res.status(401).json({ message: 'Нет авторизации' })
      }
     //раскодируем токен если он есть
      const decoded = jwt.verify(token, config.get('jwtSecret'))
       req.user = decoded
       next()
   } catch (e) {
      res.status(401).json({ message: 'Нет авторизации' })
   }
}

