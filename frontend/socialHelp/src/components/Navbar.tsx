import Logo from "../assets/cross.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [active, setActive] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const menu = [
    { name: "Home", link: "#home" },
    { name: "Serviços", link: "#servicos" },
    { name: "Comunidade", link: "#comunidade" },
    { name: "Voluntários", link: "/volunteers", route: true },
  ];

  // scroll spy
  useEffect(() => {
    const sections = ["home", "servicos", "comunidade"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // scroll background
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      setScrolled(scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
  setVisible(true);
}, []);


  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 transform ${
          visible ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
        } ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100"
            : "bg-white/20 backdrop-blur-md"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* LOGO */}
          <a href="#home" className="flex items-center gap-2">
            <img src={Logo} alt="Mãos que Servem" className="h-10 w-auto" />
            <span className="font-semibold text-gray-800 block">
              Mãos que Servem
            </span>
          </a>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
            {menu.map((item) => {
              const isActive = active === item.link.replace("#", "");

              const isRoute = item.route;

              return (
                <a
                  key={item.name}
                  href={isRoute ? undefined : item.link}
                  onClick={(e) => {
                    if (isRoute) {
                      e.preventDefault();
                      navigate(item.link);
                      setIsOpen(false);
                    }
                  }}
                  className="relative group transition-colors"
                >
                  {isRoute && item.name === "Voluntários" ? (
                    <span
                      className="
                        relative flex items-center gap-2
                        px-4 py-2 rounded-xl
                        bg-white border border-gray-200
                        text-gray-800 font-semibold
                        shadow-sm
                        transition-all duration-300
                        hover:bg-yellow-50
                        hover:border-yellow-400
                        hover:text-yellow-700
                        hover:shadow-md
                        hover:scale-[1.02]
                        active:scale-[0.98]
                      "
                    >
                      📊 {item.name}

                      {/* glow lateral */}
                      <span className="
                        absolute left-0 top-1/2 -translate-y-1/2
                        w-1 h-6 bg-yellow-400 rounded-r-full
                        opacity-0 group-hover:opacity-100
                        transition
                      " />
                    </span>
                  ) : (
                    <span
                      className={`transition-colors ${
                        isActive ? "text-gray-900" : "text-gray-600"
                      }`}
                    >
                      {item.name}
                    </span>
                  )}

                  {!isRoute && (
                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] bg-yellow-500 transition-all duration-500 ease-out ${
                        active === item.link.replace("#", "")
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  )}
                </a>
              );
            })}
          </div>


          {/* CTA DESKTOP */}
          <a
            href="#formulario"
            className="hidden md:block px-5 py-2 rounded-full bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition shadow-sm"
          >
            Participar
          </a>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-6">

          {/* close */}
          <button
            className="self-end text-2xl text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          {/* menu */}
          {menu.map((item) => {
            const isActive = active === item.link.replace("#", "");

            return (
              <a
                key={item.name}
                href={item.link}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition ${
                  isActive ? "text-yellow-600" : "text-gray-700"
                }`}
              >
                {item.name}
              </a>
            );
          })}

          {/* CTA mobile */}
          <a
            href="#formulario"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center px-5 py-3 rounded-xl bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition shadow-md"
          >
            Participar da Missão
          </a>
          <button
            onClick={() => {
              navigate("/volunteers");
              setIsOpen(false);
            }}
            className="
              relative text-lg font-semibold px-4 py-2 rounded-xl
              text-gray-800 bg-gray-100
              border border-gray-200
              transition-all duration-300
              hover:bg-yellow-50
              hover:border-yellow-400
              hover:text-yellow-700
              hover:scale-[1.02]
              active:scale-[0.98]
              shadow-sm hover:shadow-md
            "
          >
            <span className="flex items-center gap-2">
              📊 Voluntários
            </span>
          </button>

          <p className="text-xs text-gray-400 mt-6">
            Mãos que Servem · Comunidade de voluntários
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;