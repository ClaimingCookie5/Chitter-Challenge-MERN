import { useEffect, useState } from "react"
import { Api } from "../../axios/api";
import { useCookies } from "react-cookie";

export const LoginOutButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // eslint-disable-next-line
  const [cookie, setCookie, removeCookie] = useCookies(['cookie-name']);



  useEffect(() => {
    const checkLoginStatus = () => {
      if (isLoggedIn && document.cookie.length === 0) return setIsLoggedIn(!isLoggedIn);
    }

    checkLoginStatus()
  }, [isLoggedIn])

  const handleClick = async (e) => {
    e.preventDefault();
    if (isLoggedIn === false) {
      return window.location.href = '/signup-or-login';
    } else {
      try {
        await Api.post('/api/users/logout', { withCredentials: true })
        removeCookie('user')
        return window.location.href = '/signup-or-login';
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <div className='navbar_item'>
      <input type='button' value={ (isLoggedIn) ? 'Logout' : 'Login' } onClick={handleClick} className='btn nav_btn' />
    </div>
  )
}