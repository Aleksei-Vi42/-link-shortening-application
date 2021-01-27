//извлекаем роутер из express
const {Router} = require('express')
const router = Router()
//подключение псевдоюзера
const User = require('../models/User')
//подключаем npm bcrypt для хэширования пароля
const bcrypt = require('bcrypt')
//подключаем некоторые методы для валидации(npm express-validator)
const {check, validationResult} = require('express-validator')
//подключение библтотеки npm jsonwebtoken
const jwt = require('jsonwebtoken')
//доступ к секретному ключу из конфига
const config = require('config')

//создаем логику для регистрации псевдопользователей
// /api/auth/register
router.post('/register',
// валидация данных с фронтэнда
    [
       check('email', 'Некоректный email').isEmail(),
       check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })

    ],
    async (req, res) => {
    try {
        console.log('Body', req.body)
//переменная для контроля валидации
   const errors = validationResult(req)
//логика возврата данных об ошибке на фронтэнд
      if (!errors.isEmpty()) {
          return res.status(400).json({
              errors: errors.array(),
              message: 'Не корректные данные при регистрации'
          })
      }
//запросы в теле фронэнда
   const {email, password} = req.body
//проверка на уникальный email
   const  candidate =  await  User.findOne({ email })
   if (candidate) {
       return res.status(400).json({ message: 'Такой пользователь уже существует' })
   }
// регистрация + хэширование пароля
   const hashedPassword =  await bcrypt.hash(password, 12)
   const user = new User({ email, password: hashedPassword })
   await  user.save()
//ответ на фронтэнд о создании пользователя
    res.status(201).json({ message: 'Пользователь создан' })

  } catch (e) {
      res.status(500).json({ message: 'Что то пошло не так, попробуйте снова' })
  }
})
//обработка логина (примерно такая-же логика как при регистрации)
// /api/auth/login
router.post('/login',
// валидация данных с фронтэнда
    [
        check('email', 'Не коректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()

    ],
    async (req, res) => {
    try {
//переменная для контроля валидации

        const errors = validationResult(req)

//логика возврата данных об ошибке на фронтэнд
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Не корректные данные при входе в систему'
            })
        }
        //запросы в теле фронтэнда
       const {email, password} = req.body
        //поиск пользователя
       const user = await User.findOne({ email })
       //если не найден отправляем на фронтэнд сообщение
       if (!user) {
           return res.status(400).json({message: 'Пользователь не найден'})
       }
      //если пользователь найден, сравниваем пароль
       const isMatch = await bcrypt.compare(password, user.password)
      //если пароли не совпадают отправляем на фронтэнд сообщение
      //сама логика сообщеня об ошибках спорная в контксте безопастности и сделана только для примера
       if (!isMatch) {
           return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
       }
      //если все правильно при регистрации, создаем токен безопастности

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }//на какое время формируется токен
        )

        res.json({ token, userId: user.id })

       //при ошибке отправляем на фронтэенд сообщени
        } catch (e) {
            res.status(500).json({ message: 'Что то пошло не так, попробуйте снова' })
      }
    })
module.exports = router