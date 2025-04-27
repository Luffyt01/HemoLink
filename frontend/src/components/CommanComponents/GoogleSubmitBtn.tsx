/** @format */

"use client"
import { useFormStatus } from "react-dom"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import Image from "next/image";

export function GoogleSubmitBtn({ pending, setPending }: { pending: boolean; setPending: (pending: boolean) => void }) {
  useEffect(() => {
    if (pending) {
      const inter = setTimeout(() => {
        setPending(false)
      }, 5000)

      return () => clearTimeout(inter)
    }
  }, [pending])

  return (
    <span className=" text-center px-auto content-center" aria-disabled={pending}>
      {pending ? (
        "Processing..."
      ) : (
        <div
          onClick={() => {
            if (!pending) setPending(true)
          }}
          className="flex items-center gap-2">
          <Image src="/google.png" alt="google"  width={500} height={500} className="w-4 h-4" />
          <span>Sign in with Google</span>
        </div>
      )}
    </span>
  )
}