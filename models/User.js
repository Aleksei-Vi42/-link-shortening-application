
const  {Schema, model, Types} = require('mongoose')
//упрощенная базовая схема регистрации
const schema = new Schema ({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  //массив для хранения ссылок(конкретно для этого приложения)
  Links: [{ type: Types.ObjectId, ref: 'Link' }]
})

module.exports = model('User', schema)