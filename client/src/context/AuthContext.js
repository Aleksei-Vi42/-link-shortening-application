//создаем котекст для передачи методов {token, login, logout, userId} из useAuth
//на прямую для передачи всему приложению(Арр.js)
import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
//данные по умолчанию
    token: null,
    userId: null,
    login: noop,
    logout: noop,
    isAuthentificated: false
})