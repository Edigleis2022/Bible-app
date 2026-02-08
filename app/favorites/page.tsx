'use client'

import { useEffect, useState } from 'react'
import VerseCard from '@/components/VerseCard'
import { Verse } from '@/types/verse'
import './favorites.scss'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Verse[]>([])

  // carregar favoritos do navegador
  useEffect(() => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  return (
    <main className="container">
      <h1 className="title">⭐ Versículos Favoritos</h1>

      {favorites.length === 0 && <p>Nenhum versículo favoritado ainda.</p>}

      {favorites.map((verse) => (
        <VerseCard
          key={verse.id}
          verse={verse}
          onFavorite={() => {}}
          isFavorite={true}
          loading={false}
        />
      ))}
    </main>
  );
}
