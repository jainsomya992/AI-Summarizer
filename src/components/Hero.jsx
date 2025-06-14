// import { logo } from "../assets";

const Hero = () => {
    return (
        <header className='w-full flex justify-center items-center flex-col'>
            <nav className='flex justify-between items-center w-full pt-3'>
                {/* <img src={logo} alt='sumz_logo' className='w-28 object-contain' /> */}

                {/* <button
                    type='button'
                    onClick={() =>
                        window.open("https://github.com/TidbitsJS/Summize", "_blank")
                    }
                    className='black_btn'
                >
                    GitHub
                </button> */}
            </nav>

            <h1 className='head_text'>
                The
                <span className='purple_gradient '> Ultimate AI Tool</span><br className="max-md:hidden" /> for News Junkies
            </h1>
            <h2 className='desc'>
                Simplify your reading with AI Tool, an open-source article summarizer
                that transforms lengthy articles into clear and concise summaries
            </h2>
        </header>
    );
};

export default Hero;