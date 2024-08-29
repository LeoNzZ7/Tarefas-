import { Textarea } from "@/components/textarea";
import { ThemeContext } from "@/contexts/themeContext";
import { db } from "@/services/firebaseConnection";
import { Task as TaskType } from "@/types/taskType";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { comment } from "postcss";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

interface TaskProps {
    item: TaskType;
    allComments: commentProps[]
}

interface commentProps {
    id: string;
    comment: string;
    taskId: string;
    user: string;
    name: string;
    created: string
}

export default function Task({ item, allComments }: TaskProps) {
    const { data: session } = useSession()

    const [input, setInput] = useState("")
    const [comments, setComments] = useState<commentProps[] | []>(allComments || [])

    const { darkMode } = useContext(ThemeContext)

    async function HandleComment(e: FormEvent) {
        e.preventDefault()

        if (input === "") {
            return
        }

        if (!session?.user?.email || !session.user.name) {
            return
        }

        try {
            const docRef = await addDoc(collection(db, "comments"), {
                comment: input,
                user: session.user.email,
                name: session.user.name,
                created: new Date(),
                taskId: item.id,
            })

            const data = {
                id: docRef.id,
                comment: input,
                taskId: item.id,
                user: session.user.email,
                name: session.user.name,
                created: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            }

            setComments((oldItens) => [...oldItens, data])
            setInput("")

            toast.success("Comentário enviado com sucesso!", {
                icon: "✅",
                style: {
                    borderRadius: '10px',
                    background: darkMode ? '#333' : "#fff",
                    color: darkMode ? '#fff' : "#333",
                },
            })
        } catch (error) {
            toast.success("Falha ao enviar comentário.", {
                icon: "❌",
                style: {
                    borderRadius: '10px',
                    background: darkMode ? '#333' : "#fff",
                    color: darkMode ? '#fff' : "#333",
                },
            })
        }
    }

    async function handleDeleteComment(id: string) {
        try {
            const docRef = doc(db, "comments", id)
            await deleteDoc(docRef)

            setComments((oldItems) => oldItems.filter(item => item.id !== id))

            toast.success("tarefa deletada com sucesso!", {
                icon: "✅",
                style: {
                    borderRadius: '10px',
                    background: darkMode ? '#333' : "#fff",
                    color: darkMode ? '#fff' : "#333",
                },
            })
        } catch (error) {
            toast.error("Ocorreu um erro ao adicionar a tarefa.", {
                icon: "❌",
                style: {
                    borderRadius: '10px',
                    background: darkMode ? '#333' : "#fff",
                    color: darkMode ? '#fff' : "#333",
                },
            })
        }
    }

    return (
        <div className="min-h-screen dark:bg-black dark:text-white"  >
            <div className="w-full max-w-5xl  mx-auto px-5 flex items-center justify-center flex-col ">
                <Head>
                    <title>Tarefas+ | {item?.task}</title>
                </Head>
                <main className="mt-10 w-full" >
                    <h1 className="font-bold mb-4 text-3xl" >Tarefa</h1>
                    <article className="border-[1.5px] p-4 rounded-md border-neutral-600 flex flex-col justify-center items-center" >
                        <p className="whitespace-pre-wrap w-full" >
                            {item.task}
                        </p>
                        <span className="text-[12px] text-end w-full" >
                            Adicionado em {item?.created}
                        </span>
                    </article>
                </main>

                <section className="my-5 w-full max-w-5xl" >
                    <h2 className="my-3" >Deixar um comentário</h2>
                    <form onSubmit={HandleComment} >
                        <Textarea
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                            value={input}
                            placeholder="Digite o seu comentário..."
                        />
                        <button
                            disabled={!session ? true : false}
                            className="w-full py-3 rounded-md border-0 bg-[#3183ff] disabled:bg-[#2072ee] cursor-pointer text-2xl text-white"
                        >
                            Enviar comentário...
                        </button>
                    </form>
                </section>
                <section className="max-w-5xl w-full" >
                    <h2>Todos os comentários</h2>
                    {comments.length === 0 && (
                        <span>
                            Nenhum comentário encontrado.
                        </span>
                    )}
                    {comments.map((comment) => (
                        <article
                            className="border border-neutral-500 p-4 rounded-md mb-4 flex flex-col justify-center"
                            key={comment.id} >
                            <div className="flex items-center justify-between" >
                                <label className="bg-neutral-500 text-white px-1 py-2 mr-2 rounded-md ]" >
                                    {comment.name.split(" ")[0]}
                                </label>
                                {comment.user === session?.user?.email && (
                                    <button className="cursor-pointer" onClick={() => handleDeleteComment(comment.id)} >
                                        <FaTrash size={18} color="#ea3140" />
                                    </button>
                                )}
                            </div>
                            <p className="mt-4 whitespace-pre-wrap " >{comment.comment}</p>
                            <span className="text-[12px] w-full" >
                                Adicionado: {comment.created}
                            </span>
                        </article>
                    ))}
                </section>
            </div >
        </div >
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const id = params?.id as string

    const docRef = doc(db, "tasks", id)
    const snapshot = await getDoc(docRef)

    if (!snapshot.data) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    if (!snapshot.data()?.public) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    const mileseconds = snapshot.data()?.created.seconds * 1000

    const q = query(collection(db, "comments"), where("taskId", "==", id))
    const snapshotComments = await getDocs(q)

    const allComments: commentProps[] = []

    snapshotComments.forEach((doc) => {
        allComments.push({
            id: doc.id,
            comment: doc.data()?.comment,
            taskId: doc.data()?.taskId,
            user: doc.data()?.user,
            name: doc.data()?.name,
            created: new Date(doc.data().created.seconds * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        })
    })

    const task = {
        task: snapshot.data()?.task,
        created: new Date(mileseconds).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        user: snapshot.data()?.user,
        id: snapshot.id,
        public: snapshot.data()?.public
    }

    return {
        props: {
            item: task,
            allComments
        }
    }
}