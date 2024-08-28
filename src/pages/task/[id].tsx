import { Textarea } from "@/components/textarea";
import { db } from "@/services/firebaseConnection";
import { Task as TaskType } from "@/types/taskType";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSideProps } from "next";
import Head from "next/head";

interface TaskProps {
    item: TaskType;
}

export default function Task({ item }: TaskProps) {
    console.log(item)

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
                    <form>
                        <Textarea
                            placeholder="Digite o seu comentário..."
                        />
                        <button className="w-full py-3 rounded-md border-0 bg-[#3183ff] cursor-pointer text-2xl text-white" >
                            Enviar comentário...
                        </button>
                    </form>
                </section>
            </div>
        </div>
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

    const task = {
        task: snapshot.data()?.task,
        created: new Date(mileseconds).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        user: snapshot.data()?.user,
        id: snapshot.id,
        public: snapshot.data()?.public
    }

    return {
        props: {
            item: task
        }
    }
}