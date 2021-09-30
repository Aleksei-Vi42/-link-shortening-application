import {useState, useCallback} from 'react'//кастомный хук для отправки запроса на сервер

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        try {
            if (body) {   //body переводми к строковому json формату(если есть)
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'  //указывем тип данных передаваемых на сервер(обязательно)
            }

            const response = await fetch(url, {method, body, headers})//запрос с помощью fetch
            const data = await response.json()

            if (!response.ok) {
                console.log('data', data.message)
                throw new Error(data.message || 'Что то пошло не так')
            }
            setLoading(false)
            return data

        } catch (e) {
            console.log('Catch', e.message)
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    const clearError = useCallback(() => setError(null), [])

    return {loading, request, error, clearError}
}