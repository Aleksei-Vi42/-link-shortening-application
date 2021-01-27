import {useCallback} from 'react'
//выводим текст с помощью метода(window.M.toast) из библиотеки materialize-css@next
export const useMessage = () => {
  return useCallback(text => {
      if(window.M && text) {
          window.M.toast({html: text})
      }
  }, [])
}