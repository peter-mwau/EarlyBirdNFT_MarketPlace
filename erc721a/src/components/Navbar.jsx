import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useState, useEffect, useContext } from "react";
import { IoWallet } from "react-icons/io5";
import WalletContext from "../contexts/WalletContext";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { account, balance, tokenBalance, isWalletConnected, connectWallet, disconnectWallet } = useContext(WalletContext);
  
    const [theme, setTheme] = useState(() => {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    });

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        if (theme === "dark") {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
        <div className="w-full bg-white dark:bg-blue-300 shadow-lg transition-all duration-1000 fixed z-50">
            <div className="w-[80%] mx-auto">
                <nav className="p-5">
                    <div className="flex justify-between items-center">
                        <div className="items-start">
                            <a className="navbar-brand text-lg font-bold" href="#">
                                <img src="/logo1.png" className="w-10" alt="Logo" />
                            </a>
                        </div>

                        {/* Hamburger menu for small screens */}
                        <div className="md:hidden">
                            <button onClick={toggleMenu} className="text-gray-800 dark:text-white">
                                {menuOpen ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
                            </button>
                        </div>

                        {/* Menu for medium and large screens */}
                        <div className={`md:flex items-center md:space-x-6 ${menuOpen ? 'block absolute bg-gray-100 w-[200px] rounded-md right-5 mt-[400px] text-center pt-2' : 'hidden'} md:flex md:flex-row`}>
                            <ul className="flex flex-col md:flex-row gap-4 text-gray-800 dark:text-gray-900">
                                <li className="hover:cursor-pointer hover:font-semibold">
                                    <a href="#" className="px-2 py-1">Home</a>
                                </li>
                                <li className="hover:cursor-pointer hover:font-semibold">
                                    <a href="#" className="px-2 py-1">Features</a>
                                </li>
                                <li className="hover:cursor-pointer hover:font-semibold">
                                    <a href="#" className="px-2 py-1">Pricing</a>
                                </li>
                                <li className="hover:cursor-pointer hover:font-semibold">
                                    <a href="#" className="px-2 py-1">Disabled</a>
                                </li>
                            </ul>
                            <div className="flex items-center space-x-4 flex-col lg:flex-row gap-3 pt-2 md:flex-row">
                                <button
                                    type="button"
                                    onClick={toggleDropdown}
                                    className="flex items-center text-sm rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                >
                                    <IoWallet className="text-gray-900 dark:text-gray-100 w-10 h-10 p-2 border-gray-600 border-2 rounded-full" />
                                </button>

                                {/* Dropdown */}
                                <div className={`py-2 ${isDropdownOpen ? "" : "hidden"} absolute right-3 mt-[60px] md:mt-[370px] lg:mt-[350px] text-base bg-white rounded-lg shadow-lg dark:bg-gray-700`}>
                                    <ul className="py-2">
                                        <li><a href="/dashboard" className="block px-4 py-2 dark:text-gray-300">Dashboard</a></li>
                                        <li><a href="/profile" className="block px-4 py-2 dark:text-gray-300">Profile</a></li>
                                        <li>
                                            <div className="px-4 py-2 text-gray-700 dark:text-white">
                                                <p className="text-sm">Wallet Address:</p>
                                                <span className="break-words font-semibold">{account || '0x...'}</span>
                                                <p className="text-sm mt-1">Balance: </p>
                                                 <span className="break-words font-semibold">{isWalletConnected ? balance : '0'} ETH</span>
                                                <p className="text-sm mt-1">Token Balance: </p>
                                                <span className="break-words font-semibold">{isWalletConnected ? tokenBalance : 'N/A'} TTKN</span>
                                            </div>
                                        </li>
                                        <li><a href="#" className="block px-4 py-2 dark:text-gray-300">Settings</a></li>
                                    </ul>
                                </div>

                                <div className="flex items-center gap-4 flex-col lg:flex-row p-2 md:flex-row">
                                    <button
                                        onClick={toggleTheme}
                                        className="p-2 bg-blue-500 dark:bg-gray-300 rounded-full"
                                    >
                                        {theme === "dark" ? <CiLight className="w-6 h-6 text-white" /> : <MdDarkMode className="w-6 h-6 text-gray-800" />}
                                    </button>

                                    {isWalletConnected ? (
                                        <button
                                            onClick={disconnectWallet}
                                            className="bg-blue-600 text-white dark:text-gray-950 px-4 py-2 rounded-md"
                                        >
                                            Disconnect
                                        </button>
                                    ) : (
                                        <button
                                            onClick={connectWallet}
                                            className="bg-blue-600 text-white dark:text-gray-950 px-4 py-2 rounded-md"
                                        >
                                            Connect Wallet
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
        </>
    );
};

export default Navbar;
