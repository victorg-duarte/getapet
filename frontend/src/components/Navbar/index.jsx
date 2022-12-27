import { useContext } from 'react'
import { BiExit } from 'react-icons/bi'
import { Link } from 'react-router-dom'

import styles from './index.module.css';
import Logo from '../../assets/img/logo.png'
import { Context } from '../../context/UserContext';

function NavBar() {
  const { authenticated, logout } = useContext(Context)
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_logo}>
        <Link id='logo' to='/'><img src={Logo} alt="get a pet" /><h2>Get a Pet</h2></Link>

      </div>
      <ul>
        <li>
          <Link to="/">Adotar</Link>
        </li>
        {authenticated ? (
          <>
            <li><Link to='/pet/mypets'>Meus Pets</Link></li>
            <li><Link to='/pet/myadoptions'>Minhas adoções</Link></li>
            <li><Link to='/user/profile'>Perfil</Link></li>
            <li><button className={styles.btn_sair} onClick={logout}>Sair <BiExit /></button></li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" >Entrar</Link>
            </li>
            <li>
              <Link to="/register" >Registrar</Link>
            </li>
          </>
        )}
      </ul>
    </nav >
  )
}

export default NavBar