import { Verse } from "@/types/verse"
import './index.scss'

type Props = {
  verse: Verse
  onFavorite: (verse: Verse) => void
  isFavorite: boolean
}

export default function VerseCard({ verse, onFavorite, isFavorite }: Props) {
  return (
    <div className="verse-card">

      {/* texto */}
      <p className="text">"{verse.text}"</p>

      {/* referencia */}
      <span className="ref">{verse.reference}</span>

      {/* botão favorito */}
      <button 
        className="fav-btn"
        onClick={() => onFavorite(verse)}
      >
        {isFavorite ? "❤️ Favoritado" : "🤍 Favoritar"}
      </button>

    </div>
  )
}
