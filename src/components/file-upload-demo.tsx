/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState } from "react"
import { FileUpload } from "@/components/ui/file-upload"

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([])
  const handleFileUpload = (files: File[]) => {
    setFiles(files)
    console.log(files)
  }

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-slate-800/30 border-slate-700 dark:border-neutral-800 rounded-lg">
      <FileUpload onChange={handleFileUpload} />
    </div>
  )
}
