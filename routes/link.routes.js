const {Router} = require('express')
const Links = require('../models/link')
const config = require('config')
const auth  =  require('../middleware/auth.midleware')//подключаем созданный middleware для получения id(user.id
const shortid = require('shortid')//библиотека для сокращения ссылки
const router = Router()

//запрос для генерации сокращенных ссылок
router.post('/generate', auth, async (req, res) => {
try {
   const baseUrl = config.get('baseUrl')
   const {from} = req.body
   const code = shortid.generate()
//сравниваем с уже готовыми ссылками(что бы не формировать повторно)
   const existing = await Links.findOne({ from })
    if(existing) {
      return  res.json({ link: existing })
    }
//как выглядит сокращенная ссылка user
    const to = baseUrl + '/t/' + code
//создаем новую модель с нужными параметрами и сохраняем
    const link = new Links({
     code, to, from, owner: req.user.userId
    })
    await link.save()
    console.log(link)
    res.status(201).json({ link })

 } catch (e) {
   res.status(500).json({message: 'Что то пошло не так'})

   }
})
//обработка запроса для получения всех ссылок
router.get('/', auth, async (req, res) => {
try {
 const links = await Links.find({ owner: req.user.userId })
 res.json(links)
 } catch (e) {
        res.status(500).json({message: 'Что то пошло не так, попробуйте снова'})
   }
})
// обработка запроса длс получения ссылки по id
router.get ('/:id', auth, async (req, res) => {
 try {
   const links = await Links.findById(req.params.id)
   res.json(links)
 } catch (e) {
        res.status(500).json({message: 'Что то пошло не так, попробуйте снова'})
   }
})

module.exports = router
