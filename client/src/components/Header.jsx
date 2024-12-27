import { Link } from "react-router-dom"

const Header = () => {
    return (
        <header className="flex justify-center py-6">
            <h1 className="text-4xl font-bold text-center text-gray-300">
                <Link to="/" className="inline-flex items-center space-x-2">
                    <span>Minha Academia <span className="text-yellow-500">TEM?</span></span>
                </Link>
            </h1>
        </header>
    )
}

export default Header