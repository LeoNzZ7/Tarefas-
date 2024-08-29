import Head from "next/head";
import Image from "next/image";
import hero from "../assets/hero.png"
import { GetStaticProps } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

interface HomeProps {
  posts: number,
  comments: number,
}

export default function Home({ posts, comments }: HomeProps) {
  const { data: session } = useSession()

  return (
    <div className="h-[calc(100vh-76px)] dark:bg-[#0f0f0f] transition-all">
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>
      <main className="flex flex-col justify-center items-center h-full" >
        <div className="flex flex-col text-center items-center justify-center w-full" >
          <Image className="max-w-full object-contain h-auto md:w-[380px] w-[250px] drop-shadow-lg"
            src={hero}
            alt="Logo Tarefas+"
            priority />
          <h1 className="text-2xl md:text-4xl font-bold text-black dark:text-white m-7 leading-[150%]" >
            Sistema feito para você organizar <br />
            seus estudos e tarefas
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row md:flex-row w-full max-w-4xl items-center gap-4 md:gap-7  justify-center" >
          <section
            className="w-full max-w-[70%] md:w-[250px] text-center bg-[#0f0f0f] dark:bg-[#fafafa] py-4 px-11 dark:text-black text-white rounded-md cursor-pointer hover:scale-105 transition-transform" >
            <span>+{posts} posts</span>
          </section>
          <section
            className="w-full max-w-[70%] md:w-[250px] text-center bg-[#0f0f0f]  dark:bg-[#fafafa] py-4 px-11 dark:text-black text-white rounded-md cursor-pointer hover:scale-105 transition-transform" >
            <span>+{comments} comentários</span>
          </section>
        </div>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const commentRef = collection(db, "comments")
  const postRef = collection(db, "tasks")

  const commentsSnapshot = await getDocs(commentRef)
  const postsSnapshot = await getDocs(postRef)

  return {
    props: {
      posts: postsSnapshot.size || 0,
      comments: commentsSnapshot.size || 0
    },
    revalidate: 60
  }
}