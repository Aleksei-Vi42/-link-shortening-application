import React,{useState, useEffect, useCallback, useContext} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from "../hooks/http.hook"
import {AuthContext} from "../context/AuthContext"
import {Loader} from "../components/loader"
import {LinkCard} from "../components/LinkCard"

export const DetailPage = () => {
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const [link, setLink] = useState(null)
//извлекаем id готовой ссылки (<Route path='/detail/:id'>)
    const linkId = useParams().id
//метод для получени самой ссылки
    const getLink =  useCallback(async () => {
      try {
          const fetched = await request(`/api/link/${linkId}`, 'GET', null, {
              Authorization: `Bearer ${token}`
        })
        setLink(fetched)
      } catch (error) {
          console.log(error)
      }
    }, [token, linkId, request])

    useEffect(() => {
         getLink()
    }, [getLink])

    if (loading) {
        return <Loader />
    }

    return (
        <div>
          { !loading && link && <LinkCard link={link} /> }
        </div>
    )
}