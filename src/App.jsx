import { useEffect, useState } from "react";

const profiles = [
  {
    name: "Cleudemar",
    image: "/assests/perfil-1.png",
    alt: "Foto do perfil Cleudemar",
  },
  {
    name: "Beatriz",
    image: "/assests/perfil-2.png",
    alt: "Foto do perfil Beatriz",
  },
  {
    name: "Aurora",
    image: "/assests/perfil-3.jpg",
    alt: "Foto do perfil Aurora",
  },
  {
    name: "Joaquim",
    image: "/assests/perfil-4.jpg",
    alt: "Foto do perfil Joaquim",
  },
];

const THEME_STORAGE_KEY = "site-theme";
const PROFILE_NAME_STORAGE_KEY = "perfilAtivoNome";
const PROFILE_IMAGE_STORAGE_KEY = "perfilAtivoImagem";

export default function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    setTheme(savedTheme === "light" ? "light" : "dark");
    alert("Bem-vindo(a) a Netflix!");
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  function handleThemeChange(selectedTheme) {
    setTheme(selectedTheme);
  }

  function handleProfileClick(profile) {
    localStorage.setItem(PROFILE_NAME_STORAGE_KEY, profile.name);
    localStorage.setItem(PROFILE_IMAGE_STORAGE_KEY, profile.image);
    window.location.href = "/catalogo/catalogo.html";
  }

  const isLight = theme === "light";
  const mutedText = isLight ? "text-[#666666]" : "text-[#808080]";
  const hoverText = isLight ? "group-hover:text-[#171717]" : "group-hover:text-white";
  const hoverBorder = isLight ? "group-hover:border-[#171717]" : "group-hover:border-white";

  return (
    <main
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
        isLight
          ? "bg-[radial-gradient(circle_at_top,#ffffff_0%,#f0f0f0_58%,#e6e6e6_100%)] text-[#171717]"
          : "bg-[radial-gradient(circle_at_top,#151515_0%,#0f0f0f_55%,#0a0a0a_100%)] text-white"
      }`}
    >
      <div
        className={`fixed right-3 top-3 z-20 flex gap-2 rounded-full border p-1.5 shadow-2xl backdrop-blur-md sm:right-5 sm:top-5 ${
          isLight
            ? "border-black/20 bg-white/70 shadow-black/10"
            : "border-white/20 bg-black/30 shadow-black/30"
        }`}
        role="group"
        aria-label="Selecionar tema"
      >
        <button
          type="button"
          onClick={() => handleThemeChange("dark")}
          aria-label="Dark mode"
          aria-pressed={theme === "dark"}
          title="Dark mode"
          className={`grid h-9 w-9 place-items-center rounded-full border text-base transition duration-200 hover:-translate-y-0.5 hover:scale-105 sm:h-[42px] sm:w-[42px] sm:text-xl ${
            theme === "dark"
              ? "-translate-y-0.5 scale-105 border-[#3f3f3f] bg-gradient-to-b from-[#1d1d1d] to-[#101010] text-[#f1f1f1] shadow-[0_0_0_2px_rgba(255,255,255,0.35),0_6px_14px_rgba(0,0,0,0.28)]"
              : "border-transparent bg-gradient-to-b from-[#1d1d1d] to-[#101010] text-[#f1f1f1] opacity-70"
          }`}
        >
          &#127769;
        </button>

        <button
          type="button"
          onClick={() => handleThemeChange("light")}
          aria-label="Light mode"
          aria-pressed={theme === "light"}
          title="Light mode"
          className={`grid h-9 w-9 place-items-center rounded-full border text-base transition duration-200 hover:-translate-y-0.5 hover:scale-105 sm:h-[42px] sm:w-[42px] sm:text-xl ${
            theme === "light"
              ? "-translate-y-0.5 scale-105 border-[#d8d8d8] bg-gradient-to-b from-white to-[#f1f1f1] text-[#141414] shadow-[0_0_0_2px_rgba(20,20,20,0.2),0_6px_12px_rgba(20,20,20,0.15)]"
              : "border-transparent bg-gradient-to-b from-white to-[#f1f1f1] text-[#141414] opacity-70"
          }`}
        >
          &#9728;
        </button>
      </div>

      <div className="mx-auto grid min-h-screen w-[min(1060px,94vw)] place-items-center px-3 py-10 animate-[fade-up_620ms_ease-out] sm:px-4 sm:py-12">
        <div className="w-full">
          <header className="mb-10 text-center">
            <h1 className="text-[clamp(1.8rem,8.7vw,2.7rem)] font-bold tracking-[0.01em] sm:text-[clamp(2rem,4vw,4rem)]">
              Quem está assistindo?
            </h1>
          </header>

          <section aria-label="Seleção de perfis">
            <ul className="flex list-none flex-wrap justify-center gap-x-3 gap-y-5 sm:gap-4">
              {profiles.map((profile) => (
                <li key={profile.name} className="w-[150px] sm:w-[170px]">
                  <button
                    type="button"
                    onClick={() => handleProfileClick(profile)}
                    className="group w-full cursor-pointer bg-transparent text-center"
                    aria-label={`Perfil de ${profile.name}`}
                  >
                    <img
                      src={profile.image}
                      alt={profile.alt}
                      className={`mx-auto block h-32 w-32 rounded border-[3px] border-transparent object-cover transition-colors duration-200 sm:h-[148px] sm:w-[148px] ${hoverBorder}`}
                    />
                    <span
                      className={`mt-3 block text-[1.3rem] font-semibold leading-[1.1] tracking-[0.01em] transition-colors duration-200 sm:text-[1.9rem] ${mutedText} ${hoverText}`}
                    >
                      {profile.name}
                    </span>
                  </button>
                </li>
              ))}

              <li className="w-[150px] sm:w-[170px]">
                <a
                  href="#adicionar-perfil"
                  aria-label="Adicionar perfil"
                  className="group block w-full pt-1 text-center"
                >
                  <span className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-[#7f7f7f] text-[4.5rem] font-bold leading-none text-[#111111] transition-colors duration-200 group-hover:bg-[#bcbcbc] sm:h-[148px] sm:w-[148px] sm:text-8xl">
                    +
                  </span>
                  <span
                    className={`mt-3 block text-[1.3rem] font-semibold leading-[1.1] tracking-[0.01em] transition-colors duration-200 sm:text-[1.9rem] ${mutedText} ${hoverText}`}
                  >
                    Adicionar perfil
                  </span>
                </a>
              </li>
            </ul>
          </section>

          <footer className="mt-12 grid place-items-center">
            <button
              type="button"
              className={`border bg-transparent px-5 py-3 text-[0.95rem] font-semibold tracking-[0.1em] transition-colors duration-200 sm:px-8 sm:text-[1.05rem] ${
                isLight
                  ? "border-[#8f8f8f] text-[#666666] hover:border-[#171717] hover:bg-black/5 hover:text-[#171717]"
                  : "border-[#808080] text-[#808080] hover:border-white hover:bg-white/10 hover:text-white"
              }`}
            >
              Gerenciar perfis
            </button>
          </footer>
        </div>
      </div>
    </main>
  );
}
