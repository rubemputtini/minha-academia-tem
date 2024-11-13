import logo from "../assets/logo.svg";
import { socialMedia } from "../utils/constants";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <section className="flex flex-col justify-center items-center py-8 mt-4">
            <div className="flex flex-col md:flex-row mb-8 w-full items-center">
                <div className="flex-1 flex flex-col md:flex-row w-full md:w-auto items-center">
                    <img
                        src={logo}
                        alt="Rubem Puttini"
                        className="w-[266px] h-[72px] object-contain xs:mb-7"
                    />
                </div>
            </div>
            <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]">
                <div className="flex flex-col items-center md:items-start md:flex-row">
                    <p className="font-poppins font-normal text-center md:text-left text-[18px] leading-[27px] text-white">
                        Rubem Puttini © {currentYear}.
                    </p>
                    <p className="font-poppins font-normal text-center md:text-left text-[18px] leading-[27px] text-white order-last md:order-none">
                        &nbsp;Todos os direitos reservados
                    </p>
                </div>
                <div className="flex flex-row md:mt-0 mt-6">
                    {socialMedia.map((social) => (
                        <a href={social.link} target="_blank" rel="noopener noreferrer" key={social.id}>
                            <img
                                src={social.icon}
                                alt={social.id}
                                className={`w-[21px] h-[21px] object-contain cursor-pointer ${social.id !== socialMedia[socialMedia.length - 1].id ? "mr-6" : "mr-0"}`}
                            />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Footer;
