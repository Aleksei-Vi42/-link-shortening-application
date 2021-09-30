import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from "../hooks/http.hook"//импортируем кастомный хук для обработки запроса
import {useMessage} from "../hooks/message.hock"//импортируем кастомный хук для выводана экран сообщения об ошибке
import {AuthContext} from "../context/AuthContext"//импортируем контекст для использования методов из хука useAuth

export const AuthPage = () => {//обработка формы
    const auth = useContext(AuthContext)
    const message = useMessage()
    const {loading, request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect(() => {//показываем сообщение об ошибке пользователю на фронтэнд с помощью созданого хука useMessage
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {//делаем инпуты активными по умолчанию через обращение к глобальному обьекту
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {//обрабатываем форму, changeHandler предаем в input(onChange)
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {//registerHandler передаем в button(регистрация)
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
        } catch (e) {

        }
    }

    const loginHandler = async () => {//loginHandler передаем вutton  'войти'
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch (e) {

        }
    }

    return (
        <div className="row">
            <div className="col 6s offset-s3">
                <h1>Сократи ссылку</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                            <div className="input-field">
                                <input placeholder="Введите email"
                                       id="email"
                                       type="text"
                                       name="email"
                                       className="yellow-input"
                                       value={form.email}
                                       onChange={changeHandler}
                                />
                                <label htmlFor="email">email</label>
                            </div>
                            <div className="input-field">
                                <input placeholder="Введите пароль"
                                       id="password"
                                       type="password"
                                       name="password"
                                       className="yellow-input"
                                       value={form.password}
                                       onChange={changeHandler}
                                />
                                <label htmlFor="email">пароль</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button className="btn yellow darken-4"
                                style={{marginRight: 10}}
                                onClick={loginHandler}
                                disabled={loading}
                        >
                            Войти
                        </button>
                        <button className="btn grey lighten-1 black-text"
                                onClick={registerHandler}
                                disabled={loading}
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}