import logoImg from '@/assets/logo.png'
import classes from './main-header.module.css'
import Link from "next/link";
import Image from "next/image";
import MainHeaderBackgroud from '@/components/main-header/main-header-background';
import NavLink from './nav-link';

export default function MainHeader() {

  return <header className={classes.header}>
    <MainHeaderBackgroud />
    <Link className={classes.logo} href='/'>
      <Image src={logoImg} alt="A plate with food on it" priority/>
      Food Blog
    </Link>

    <nav className={classes.nav}>
      <ul>
        <li>
          <NavLink href="/meals">Browse Meals</NavLink>
        </li>
        <li>
          <NavLink href="/community">FoodBlog Community</NavLink>
        </li>
      </ul>
    </nav>
  </header>
}