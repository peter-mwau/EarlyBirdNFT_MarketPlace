import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useState, useEffect, useContext } from "react";
import { IoWallet } from "react-icons/io5";
import WalletContext from "../contexts/WalletContext";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { account, balance, tokenBalance, isWalletConnected } = useContext(WalletContext);
  // Check if user prefers dark mode
  const [theme, setTheme] = useState(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? "dark"
      : "light";
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
};

  // Update the body class based on the theme state
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

  // State to handle mobile menu toggle
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle the menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
    <div className="w-full bg-gray-100 dark:bg-blue-400 transition-all duration-1000 fixed">
    <div className="w-[80%] mx-auto">
      <nav className=" p-5">
        <div className="flex justify-between items-center">
          <div className="items-start">
            <a className="navbar-brand text-lg font-bold" href="#">
              <img src="/logo1.png" className="w-10"/>
            </a>
          </div>

          {/* Hamburger menu for small screens */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-800 dark:text-white">
              {menuOpen ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
            </button>
          </div>

          {/* Menu for medium and large screens */}
          <div className={`md:flex flex-col md:flex-row items-center lg:justify-around justify-between w-full md:w-auto ${menuOpen ? 'block absolute bg-gray-500 w-[150px] rounded-md right-5 mt-[350px]' : 'hidden'} md:block`}>
            <ul className="flex flex-col md:flex-row gap-4 p-2 text-gray-800 dark:text-gray-900">
              <li className="hover:cursor-pointer hover:font-semibold">
                <a className="px-2 py-1" aria-current="page" href="#">
                  Home
                </a>
              </li>
              <li className="hover:cursor-pointer hover:font-semibold">
                <a className="px-2 py-1" href="#">
                  Features
                </a>
              </li>
              <li className="hover:cursor-pointer hover:font-semibold">
                <a className="px-2 py-1" href="#">
                  Pricing
                </a>
              </li>
              <li className="hover:cursor-pointer hover:font-semibold">
                <a className="px-2 py-1">Disabled</a>
              </li>
            </ul>
            <div className="flex items-center">
					<div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse flex-col">
						<button
							type="button"
							onClick={toggleDropdown}
							className="flex text-sm rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
							id="user-menu-button"
							aria-expanded="false"
							data-dropdown-toggle="user-dropdown"
							data-dropdown-placement="bottom"
						>
							<IoWallet className={`text-gray-900 dark:text-gray-100 w-10 h-10 p-2 border-gray-600 border-2 rounded-full${isWalletConnected ? 'border-2 border-yellow-500 rounded-full' : 'border-gray-600 border-2 rounded-full'}`}/>
							
						</button>
						{/* <!-- Dropdown menu --> */}
						<div
							className={`py-2 space-y-2 ${
								isDropdownOpen ? "" : "hidden"
							} z-50 my-4 absolute right-3 mt-[60px] text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown`}
						>
							<ul className="py-2" aria-labelledby="user-menu-button">
								<li>
									<a
										href="/dashboard"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
									>
										Dashboard
									</a>
								</li>
								<li>
									<a
										href="/profile"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
									>
										Profile
									</a>
								</li>
								<li>
								<div className="px-4 w-[300px]">
                                    {/* Wallet details content here */}
                                    <p className='font-light text-sm text-gray-700 dark:text-gray-50'>Wallet Address:</p>
                                    <span className='text-wrap italic text-sm font-semibold dark:text-gray-50 break-words items-center justify-center py-2'>{account ? account : '0x...'}</span>
                                    <p className='font-light text-sm text-gray-700 dark:text-gray-50'>Balance:</p>
                                    <span className='text-wrap italic text-sm font-semibold dark:text-gray-50 items-center justify-center py-2'> {isWalletConnected ?balance : '0'} ETH</span>
									<p className='font-light text-sm text-gray-700 dark:text-gray-50'>Token Balance:</p>
									<span className='text-wrap italic text-sm font-semibold dark:text-gray-50 items-center justify-center py-2'> {isWalletConnected ?tokenBalance : 'N/A'} TTKN</span>
                                </div>
								</li>
								<li>
									<a
										href="#me"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
									>
										Settings
									</a>
								</li>
								<li>
									<a
										href="#me"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
									>
										Earnings
									</a>
								</li>
								
							</ul>
						</div>
                    </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0 flex-col p-2 lg:flex-row">
              <button
                className="navbar-toggler"
                onClick={toggleTheme}
                aria-label="Toggle navigation"
              >
                {theme === "dark" ? (
                  <CiLight className="w-8 h-8 text-white" />
                ) : (
                  <MdDarkMode className="w-8 h-8 text-gray-800" />
                )}
              </button>

                
              <button className="bg-gray-500 text-white dark:text-gray-950 font-normal dark:bg-gray-300 hover:cursor-pointer hover:shadow-md hover:shadow-white rounded-md p-2">
                Connect Wallet
              </button>
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
