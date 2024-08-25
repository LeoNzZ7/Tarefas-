import { HTMLProps } from "react"

export const Textarea = ({ ...rest }: HTMLProps<HTMLTextAreaElement>) => {
    return <textarea
        className="w-full dark:bg-neutral-900 bg-neutral-200 dark:border-white outline-none resize-none h-[160px] rounded-lg p-2"
        {...rest} >
    </textarea>
}