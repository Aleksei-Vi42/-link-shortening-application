import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook.js'
import {ListLinks} from  '../components/ListLinks'
import {Loader} from "../components/loader"
import {AuthContext} from "../context/AuthContext"


export const LinksPage = () => {
    const {loading, request} = useHttp()
    const {token} = useContext(AuthContext)
    const [links, setLink] = useState([])

    const fetchLinks = useCallback(async() => {
       
       try{
        const fetched = await request('/api/link', 'GET', null, {
            Authorization: `Bearer ${token}`
        })
        setLink(fetched)
       } catch(e) {}
    }, [token, request])
  
    useEffect(() => {
        fetchLinks()
    }, [fetchLinks])

    if(loading) {
        return <Loader />
    }
    return (
       
        <>
           {!loading && <ListLinks links={links} />}
        </>
    )
}