//модель для ссылок
const  {Schema, model, Types} = require('mongoose')

const schema = new Schema ({
 from: {type : String, required: true},//откуда ссылка
 to: {type: String, required: true, unique: true},//куда
 code: {type: String, required: true, unique: true},
 date: {type: Date, default: Date.now},
 clicks: {type: Number, default: 0},
 owner: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('Link', schema)