import Link from "next/link";
export default function RegisterForm() {
  return (
    <div>
      <div className="h-screen w-screen flex justify-center items-center dark:bg-gray-900">
        <div className="grid gap-8">
          <div
            id="back-div"
            className="bg-gradient-to-r from-neutral-950 to-orange-950 rounded-[26px] m-4"
          >
            <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-zinc-50 shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
              <h1 className="pb-6 font-bold dark:text-gray-400 text-5xl text-center cursor-default">
                Zarejestruj się!
              </h1>
              <form action="#" method="post" className="space-y-4">
                <div>
                  <label className="mb-2 dark:text-gray-400 text-lg">
                    Nazwa Użytkownika
                  </label>
                  <input
                    id="username"
                    className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 placeholder:text-base border-gray-300 rounded-lg w-full"
                    type="text"
                    placeholder="Nazwa Użytkownika"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2  dark:text-gray-400 text-lg">
                    Email
                  </label>
                  <input
                    id="email"
                    className="border p-3 dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 dark:text-gray-400 text-lg">
                    Hasło
                  </label>
                  <input
                    id="password"
                    className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 placeholder:text-base border-gray-300 rounded-lg w-full"
                    type="password"
                    placeholder="Hasło"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 dark:text-gray-400 text-lg">
                    Powtórz Hasło
                  </label>
                  <input
                    id="password-retype"
                    className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300  dark:border-gray-700 placeholder:text-base border-gray-300 rounded-lg w-full"
                    type="password"
                    placeholder="Powtórz Hasło"
                    required
                  />
                </div>
                <button
                  className="bg-gradient-to-r dark:text-gray-300 from-neutral-950 to-orange-950 shadow-lg mt-6 p-2 text-white w-full hover:scale-105 hover:from-orange-950 hover:to-neutral-950 transition duration-300 ease-in-out"
                  type="submit"
                >
                  UTWÓRZ KONTO
                </button>
              </form>
              <div className="flex flex-col mt-4 items-center justify-center text-sm">
                <h3 className="dark:text-gray-300">
                  Masz konto?&nbsp;
                  <Link
                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                    href="/login"
                  >
                    <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                      Zaloguj się!
                    </span>
                  </Link>
                </h3>
              </div>
              <div className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm">
                <p className="cursor-default">
                  Tworząc konto, zgadzasz się z&nbsp;
                  <a
                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                    href="#"
                  >
                    <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                      Regulaminem
                    </span>
                  </a>
                  &nbsp;oraz&nbsp;
                  <a
                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                    href="#"
                  >
                    <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                      Polityką Prywatności
                    </span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
