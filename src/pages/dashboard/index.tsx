import { Textarea } from "@/components/textarea";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { FaTrash } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

export default function Dashboard() {
    return (
        <div className="dark:bg-[#0f0f0f] w-full dark:text-white transition-all" >
            <Head>
                <title>Tarefas+ | Painel de tarefas</title>
            </Head>
            <main className="w-full flex flex-col items-center justify-center" >
                <section className="max-w-5xl w-full px-5 pb-7 mt-14 drop-shadow-md" >
                    <div className="" >
                        <h1 className="mb-2 font-bold text-2xl" >Qual a sua tarefa?</h1>
                        <form>
                            <Textarea placeholder="Digite qual a sua tarefa?" />
                            <div className="flex items-center" >
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 my-4" />
                                <label className="ml-2">Tarefa pública?</label>
                            </div>
                            <button
                                className="w-full border-0 rounded-xl py-3 text-white bg-[#3183ff] text-xl"
                                type="submit">
                                Registrar
                            </button>
                        </form>
                    </div>
                </section>
                <section className="w-full max-w-5xl mt-8 mx-auto mb-0 px-4 flex flex-col" >
                    <h1 className="text-2xl font-bold text-center mb-3">
                        Minhas tarefas
                    </h1>
                    <article
                        className="mb-14 leading-[150%] flex border p-5 rounded-lg dark:border-neutral-300 border-neutral-700 flex-col items-start" >
                        <div className="flex items-center justify-center mb-2" >
                            <label className="bg-[#3183ff] py-[2px] px-2 text-white rounded-[4px] text-sm" >Público</label>
                            <button className="mx-2 cursor-pointer" >
                                <FiShare2 size={22} color="#3183ff" />
                            </button>
                        </div>
                        <div className="flex justify-between items-center w-full" >
                            <p className="whitespace-pre-wrap" >
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est vitae asperiores necessitatibus adipisci? Nulla ut nemo fugit ex exercitationem numquam eos. Quidem inventore dolorem, deleniti explicabo perspiciatis exercitationem commodi alias.
                            </p>
                            <button className="cursor-pointer" >
                                <FaTrash size={24} color="#ea3140" />
                            </button>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req });

    if (!session?.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}