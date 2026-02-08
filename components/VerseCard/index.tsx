import { Verse } from "@/types/verse"
import './index.scss'

type Props = {
  verse: Verse
  onFavorite: (verse: Verse) => void
  isFavorite: boolean
  loading: boolean
}


export default function VerseCard({ verse, onFavorite, isFavorite, loading }: Props) {

  if (loading) {
    return (
      <div className="verse-card loading">
        <div className="spinner"></div>
        <p>Carregando versículo...</p>
      </div>
    )
  }

  return (
    <div className="verse-card">
      <p className="text">"{verse.text}"</p>
      <span className="ref">{verse.reference}</span>

      <button 
        className="fav-btn"
        onClick={() => onFavorite(verse)}
      >
        {isFavorite ? "❤️ Favoritado" : "🤍 Favoritar"}
      </button>
    </div>
  )

  
}

