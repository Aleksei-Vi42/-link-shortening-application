const {Router} = require('express')
const router = Router()
const User = require('../models/User')//подключаем создануую модель User
const bcrypt = require('bcrypt')// npm bcrypt для хэширования пароля
const {check, validationResult} = require('express-validator')//некоторые методы для валидации(npm express-validator)
const jwt = require('jsonwebtoken')// npm jsonwebtoken
const config = require('config')//доступ к секретному ключу из конфига

// /api/auth/register
router.post('/register',
// валидация данных с фронтэнда(express-validator)
    [
        check('email', 'Некоректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({min: 6})
    ],
    async (req, res) => {
        try {
            console.log('Body', req.body)

            const errors = validationResult(req)//переменная для контроля валидации
            if (!errors.isEmpty()) {//логика возврата данных об ошибке на фронтэнд
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Не корректные данные при регистрации'
                })
            }

            const {email, password} = req.body//запросы в теле фронэнда

            const candidate = await User.findOne({email})//проверка на уникальный email
            if (candidate) {
                return res.status(400).json({message: 'Такой пользователь уже существует'})
            }

            const hashedPassword = await bcrypt.hash(password, 12)// регистрация + хэширование пароля
            const user = new User({email, password: hashedPassword})
            await user.save()
            res.status(201).json({message: 'Пользователь создан'})//ответ на фронтэнд о создании пользователя
        } catch (e) {
            res.status(500).json({message: 'Что то пошло не так, попробуйте снова'})
        }
    })
//обработка логина (примерно такая-же логика как при регистрации)
// /api/auth/login
router.post('/login',
    [
        check('email', 'Не коректный email').normalizeEmail().isEmail(),// валидация данных с фронта
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)//переменная для контроля валидации
            if (!errors.isEmpty()) {//логика возврата данных об ошибке на фронтэнд
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Не корректные данные при входе в систему'
                })
            }

            const {email, password} = req.body
            const user = await User.findOne({email})     //поиск пользователя

            if (!user) {  //если не найден отправляем на фронтэнд сообщение
                return res.status(400).json({message: 'Пользователь не найден'})
            }
            const isMatch = await bcrypt.compare(password, user.password)//если пароли не совпадают отправляем на фронтэнд сообщение
            if (!isMatch) {
                return res.status(400).json({message: 'Неверные данные, попробуйте снова'})
            }

            const token = jwt.sign(    //если все правильно при регистрации, создаем токен безопастности
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}//на какое время формируется токен
            )
            res.json({token, userId: user.id})
        } catch (e) {    //при ошибке отправляем на фронтэенд сообщени
            res.status(500).json({message: 'Что то пошло не так, попробуйте снова'})
        }
    })
module.exports = router