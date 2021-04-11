 //создаем хук для обработки и сохранения некоторых данных  в браузере
// и прикручиваем в Арр.js
import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {

   const [token, setToken] = useState(null)
   const [userId, setUserId] = useState(null)
  //флаг показывает что модуль аторизации отработал
   const [ready, setReady] = useState(false)
  //метод для входа в приложение
   const login = useCallback((jwtToken, id) => {
       setToken(jwtToken)
       setUserId(id)
   //записываем все в localStorage(базовый браузерный API)
       localStorage.setItem(storageName, JSON.stringify( {
           userId: id, token: jwtToken
       }))
   }, [])

   //метод для выхода из приложения
   const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    localStorage.removeItem(storageName)
}, [])
  //если в localStorage что то есть, передаем это в начальный localState(login)
  //что бы при перезагрузке страницы не вылетать из приложения
     useEffect(() => {
      const data = JSON.parse(localStorage.getItem(storageName))
      if(data && data.token) {
        login(data.token, data.userId)
      }
      setReady(true)
     }, [login])

   return { login, logout, token, userId, ready }
}