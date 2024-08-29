import { Textarea } from "@/components/textarea";
import { ThemeContext } from "@/contexts/themeContext";
import { db } from "@/services/firebaseConnection";
import { Task as Tasks } from "@/types/taskType";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

interface HomeProps {
    user: {
        email: string;
    }
}

export default function Dashboard({ user }: HomeProps) {
    const [input, setInput] = useState("")
    const [publicTask, setPublicTask] = useState(false);
    const [tasks, setTasks] = useState<Tasks[] | []>([])

    const { darkMode } = useContext(ThemeContext)

    function handleChangePublic(e: ChangeEvent<HTMLInputElement>) {
        setPublicTask(!publicTask)
    }

    async function handleRegisterTask(e: FormEvent) {
        e.preventDefault()

        if (input === "") {
            return
        }

        try {
            await addDoc(collection(db, "tasks"), {
                task: input,
                created: new Date(),
                user: user?.email,
                public: publicTask,
            })

            toast.success("Tarefa adicionada com sucesso", {
                icon: '✅',
                style: {
                    borderRadius: '10px',
                    background: darkMode ? '#333' : "#fff",
                    color: darkMode ? '#fff' : "#333",
                },
            })
            setInput("")
            setPublicTask(false)
        } catch (e) {
            toast.error("Ocorreu um erro ao adicionar a tarefa", {
                icon: "❌",
                style: {
                    borderRadius: '10px',
                    background: darkMode ? '#333' : "#fff",
                    color: darkMode ? '#fff' : "#333",
                },
            })
        }
    }

    useEffect(() => {
        async function loadTarefas() {
            const tarefasRef = collection(db, "tasks")
            const q = query(
                tarefasRef,
                orderBy("created", "desc"),
                where("user", "==", user?.email)
            )

            onSnapshot(q, (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    task: doc.data().task,
                    created: new Date(doc.data().created.seconds * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                    user: doc.data().user,
                    public: doc.data().public,
                }))

                setTasks(data)
            })
        }

        loadTarefas()
    }, [user.email])

    async function handleShare(id: string) {
        await navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_URL}/task/${id}`
        )
    }

    async function handleDeleteTask(id: string) {
        const docRef = doc(db, 'tasks', id)
        await deleteDoc(docRef).then(() => {
            toast.success("Tarefa excluída com sucesso", {
                icon: '✅',
                style: {
                    borderRadius: '10px',
                    background: darkMode ? '#333' : "#fff",
                    color: darkMode ? '#fff' : "#333",
                },
            })
        }).catch(() => {
            toast.error("Ocorreu um erro ao tentar excluir a tarefa", {
                icon: "❌",
                style: {
                    borderRadius: '10px',
                    background: darkMode ? '#333' : "#fff",
                    color: darkMode ? '#fff' : "#333",
                },
            })
        })
    }

    return (
        <div className="dark:bg-[#0f0f0f] w-full min-h-[calc(100vh-76px)] dark:text-white transition-all" >
            <Head>
                <title>Tarefas+ | Painel de tarefas</title>
            </Head>
            <main className="w-full flex flex-col items-center justify-center" >
                <section className="max-w-5xl w-full px-5 pb-7 mt-14 drop-shadow-md" >
                    <div className="" >
                        <h1 className="mb-2 font-bold text-2xl" >Qual a sua tarefa?</h1>
                        <form onSubmit={handleRegisterTask} >
                            <Textarea
                                value={input}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                                placeholder="Digite qual a sua tarefa?" />
                            <div className="flex items-center" >
                                <input
                                    checked={publicTask}
                                    onChange={handleChangePublic}
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
                    {tasks && tasks.map((task) => (
                        <article key={task.id}
                            className="mb-14 leading-[150%] flex border p-5 rounded-lg dark:border-neutral-300 border-neutral-700 flex-col items-start" >
                            <div className="flex items-center justify-center mb-2" >
                                {task.public && (
                                    <label className="bg-[#3183ff] py-[2px] px-2 text-white rounded-[4px] text-sm" >Público</label>
                                )}
                                <button className="mx-2 cursor-pointer" onClick={() => handleShare(task.id)} >
                                    <FiShare2 size={22} color="#3183ff" />
                                </button>
                            </div>
                            <div className="flex justify-between items-center w-full" >
                                {task.public ? (
                                    <Link href={`/task/${task.id}`}>
                                        <p className="whitespace-pre-wrap" >
                                            {task.task}
                                        </p>
                                        <span className="text-sm text-neutral-400 mt-10" >
                                            Adicionado em {task.created}
                                        </span>
                                    </Link>
                                ) : (
                                    <div >
                                        <p className="whitespace-pre-wrap" >
                                            {task.task}
                                        </p>
                                        <span className="text-sm text-neutral-400 mt-10" >
                                            Adicionado em {task.created}
                                        </span>
                                    </div>
                                )}
                                <button className="cursor-pointer" onClick={() => handleDeleteTask(task.id)} >
                                    <FaTrash size={24} color="#ea3140" />
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div >
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
        props: {
            user: {
                email: session.user.email
            }
        }
    }
}