import React, {useContext ,useState, useEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {useHistory} from "react-router-dom";


export const CreatePage = () => {
//autContext берем из созданного ранее нами контекста(authContext)
// токен хранящийся в auth добавляем как header в data четвертым параметром
  const auth = useContext(AuthContext)
// метод request берем из созданного нами ранее хука (http.hook)
  const {request} = useHttp()
  const [link, setLink] = useState('')
//для редиректа на ditail
  const history = useHistory()
//делаем инпуты активными по умолчанию
   useEffect(() => {
        window.M.updateTextFields()
   }, [])
//сохранение ссылки при нажатии кнопки enter передаем в input
  const pressHandler = async event => {
    if (event.key === 'Enter') {
      try {
       const data = await request('/api/link/generate', 'POST', {from: link}, {
           Authorization: `Bearer ${auth.token}` 
       })
       console.log('data', data)
     //редирект на страницу detail после создания ссылки
         history.push(`/detail/${data.link._id}`)
      } catch (e) {}
    }
  }

    return (
      <div className="row">
       <div className="col s8 offset-s2" style={{paddngTop: '2rem'}}>
           <input placeholder="Вставьте ссылку"
               id="link"
               type="text"
               value={link}
               onChange={e => setLink(e.target.value)}
               onKeyPress={pressHandler}
           />
           <label htmlFor="link">введите ссылку</label>
       </div>
      </div>
    )
}