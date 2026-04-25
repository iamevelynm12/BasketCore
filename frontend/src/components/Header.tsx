import { Link } from 'react-router';
import MobileNav from './MobileNav';
import MainNav from './MainNav';

export default function Header(){
    return(
        <div className="border-b-2 border-b-blue-950 py-6">
            <div className="container mx-auto flex justify-between items-center">
               <Link to="/" 
                className='text-3xl front-bold tracking-tight text-blue-200'>
                    AppBasketCore.com
                </Link>
                <div className="md:hidden">
                    <MobileNav/>
                </div>
                <div className='hidden md:block'>
                    <MainNav/>
                </div>
            </div>
        </div>
    )
}