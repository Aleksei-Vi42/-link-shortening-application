import React, {useContext} from 'react'
import {AuthContext} from '../context/AuthContext'
import {NavLink, useHistory} from 'react-router-dom'

//ссылки-кнопки с навигацией по приложению
export const Navbar = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
//функция для выхода и редиректа на главную(прикручиваем к ссылке >выйти<)
    const logoutHandler = event => {
      event.preventDefault()
      auth.logout()
      history.push('/')
    }

//встроенные css стили заданы с помощью библиотеки "materialize-css"/navbar
    return (
        <nav>
            <div className="nav-wrapper blue-grey" style={{ padding: '0 2rem'}}>
                <span className="brand-logo">Сокращение ссылок</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/create">Создать</NavLink></li>
                    <li><NavLink to="/links">Ссылки</NavLink></li>
                    <li><a href="/" onClick={logoutHandler}>Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}