'use client'

import { useEffect, useState } from 'react'

export function TypingEffect() {
    const [currentText, setCurrentText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)


    const phrases = [
        "Você usa a segurança dos grandes bancos, investindo em títulos protegidos pelo FGC.",
        "Consegue investir de forma automatizada nos melhores títulos que esgotam rápido.",
        "Nosso propósito é garantir que investidores individuais possam investir em títulos que somente grandes empresas conseguiam antes da SecureYield!",
        "💵💰 Faça parte disso também 💵💰"
    ]

    useEffect(() => {
        const currentPhrase = phrases[currentPhraseIndex]
        const typeSpeed = isDeleting ? 25 : 50

        if (!isDeleting) {
            if (currentText.length < currentPhrase.length) {
                const timeout = setTimeout(() => {
                    setCurrentText(currentPhrase.slice(0, currentText.length + 1))
                }, typeSpeed)

                return () => clearTimeout(timeout)
            } else {
                const timeout = setTimeout(() => setIsDeleting(true), 2000)
                return () => clearTimeout(timeout)
            }
        } else {
            if (currentText.length > 0) {
                const timeout = setTimeout(() => {
                    setCurrentText(currentText.slice(0, -1))
                }, typeSpeed)

                return () => clearTimeout(timeout)
            } else {
                setIsDeleting(false)
                setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
            }
        }
    }, [currentText, isDeleting, currentPhraseIndex])

    return (
        <span className="font-inter text-[#ff00ff]">
      {currentText}
            <span className="ml-1 animate-blink">|</span> {/* Cursor piscando */}
    </span>
    )
}