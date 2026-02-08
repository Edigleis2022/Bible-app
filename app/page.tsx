'use client'

import { useState, useEffect } from 'react'
import VerseCard from '@/components/VerseCard'
import { verses } from '@/data/verses'
import { Verse } from '@/types/verse'
import './page.scss'
import Link from 'next/link'


export default function Home() {

  const [loading, setLoading] = useState(false)


  // 🎯 Versículo aleatório inicial
  const [index, setIndex] = useState(
    Math.floor(Math.random() * verses.length)
  )

  // ❤️ Lista de favoritos
  const [favorites, setFavorites] = useState<Verse[]>([])
  


  // 🌙 Tema escuro
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // carregar favoritos salvos
useEffect(() => {
  const saved = localStorage.getItem("favorites");
  if (saved) {
    setFavorites(JSON.parse(saved));
  }
}, []);


  // 📦 Carregar favoritos do localStorage quando abrir app
  useEffect(() => {
    const saved = localStorage.getItem('favorites')

    if (saved) {
      setFavorites(JSON.parse(saved))
    }

    const theme = localStorage.getItem('theme')
    if (theme === 'light') setDark(false)
  }, [])

  // 💾 Sempre que favoritos mudar, salva no navegador
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // 💾 Salvar tema
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);


  // 🔁 Novo versículo
  function newVerse() {
  setLoading(true)

  setTimeout(() => {
    const random = Math.floor(Math.random() * verses.length)
    setIndex(random)
    setLoading(false)
  }, 400) // tempo da animação
}


  // ❤️ Favoritar versículo
  function toggleFavorite(verse: Verse) {
    const exists = favorites.find(v => v.id === verse.id)

    if (exists) {
      // remove se já existe
      setFavorites(favorites.filter(v => v.id !== verse.id))
    } else {
      // adiciona
      setFavorites([...favorites, verse])
    }
  }

  return (
    <main className={dark ? "container dark" : "container"}>
      <h1 className="title">📖 Bible App</h1>

      <Link href="/favorites">
        <button className="btn-fav-page">Ver favoritos ⭐</button>
      </Link>

      {/* botão tema */}
      <button className="theme-btn" onClick={() => setDark(!dark)}>
        {dark ? "🌙 Dark" : "☀️ Light"}
      </button>

      <VerseCard
        verse={verses[index]}
        onFavorite={toggleFavorite}
        isFavorite={favorites.some((v) => v.id === verses[index].id)}
        loading={loading}
      />

      <button className="btn-new" onClick={newVerse}>
        Novo versículo
      </button>
    </main>
  );
}
