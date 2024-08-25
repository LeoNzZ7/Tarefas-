import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { ThemeSwitcher } from "../ThemeSwitcher"

export const Header = () => {
    const { data: session, status } = useSession()

    return (
        <header
            className="w-full h-[76px] bg-neutral-100 dark:bg-[#0f0f0f] flex items-center content-center text-black dark:text-white drop-shadow-md transition-colors" >
            <section className="px-5 max-w-5xl w-full flex items-center justify-between m-auto" >
                <nav className="flex items-center" >
                    <Link href="/">
                        <h1 className="font-bold text-3xl dark:text-white" >
                            Tarefas<span className="text-red-600 pl-1" >+</span>
                        </h1>
                    </Link>
                    {session?.user ? (
                        <Link className="dark:bg-neutral-100 bg-[#0f0f0f] dark:text-black text-white py-1 px-4 mx-4 rounded-md" href="/dashboard">
                            Meu Painel
                        </Link>
                    ) : null}
                </nav>
                <div className="flex gap-5" >
                    {status === "loading" ? (
                        <>
                        </>
                    ) : session ? (
                        <button
                            onClick={() => signOut()}
                            className="py-2 px-8 lg:text-xl text-[10px] rounded-3xl border border-black dark:border-white hover:font-bold cursor-pointer hover:scale-105 transition-all"
                        >
                            Olá, {session.user?.name ? session?.user?.name.split(" ")[0] as string : ""}
                        </button>
                    ) : (
                        <button
                            onClick={() => signIn("google")}
                            className="py-2 px-8 rounded-3xl border border-black dark:border-white hover:font-bold cursor-pointer hover:scale-105 transition-all"
                        >
                            Acessar
                        </button>
                    )}
                    <ThemeSwitcher />
                </div>
            </section>
        </header>
    )
}