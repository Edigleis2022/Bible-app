"use client";

import { useState, useEffect } from "react";
import VerseCard from "@/components/VerseCard";
import { verses } from "@/data/verses";
import { Verse } from "@/types/verse";
import { getRandomVerse } from "@/app/services/bibleApi";
import "./page.scss";
import Link from "next/link";

function getVerseOfDay(verses: Verse[]) {
    const today = new Date().toDateString(); // data de hoje
    const saved = localStorage.getItem("verseDay");

    if (saved) {
      const parsed = JSON.parse(saved);

      // se já salvou hoje, retorna o mesmo
      if (parsed.date === today) {
        return parsed.verse;
      }
    }

    // sorteia versículo baseado no dia
    const index = new Date().getDate() % verses.length;
    const verse = verses[index];

    localStorage.setItem(
      "verseDay",
      JSON.stringify({
        date: today,
        verse: verse,
      }),
    );

    return verse;
  }

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);
  const [verseDay, setVerseDay] = useState<Verse | null>(null);

  // 🎯 Versículo aleatório inicial
  const [index, setIndex] = useState(0);

  // ❤️ Lista de favoritos
  const [favorites, setFavorites] = useState<Verse[]>([]);

  // 🌙 Tema escuro
  // começa false
  const [dark, setDark] = useState(false);

  // carrega tema só no navegador
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDark(true);
    }
  }, []);

  // 📦 Carregar favoritos do localStorage quando abrir app
  useEffect(() => {
    const saved = localStorage.getItem("favorites");

    if (saved) {
      setFavorites(JSON.parse(saved));
    }

    const theme = localStorage.getItem("theme");
    if (theme === "light") setDark(false);
  }, []);

  // 💾 Sempre que favoritos mudar, salva no navegador
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // 💾 Salvar tema
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const verse = getVerseOfDay(verses);
    setVerseDay(verse);
  }, []);


  useEffect(() => {
  const random = Math.floor(Math.random() * verses.length);
  setIndex(random);
}, []);

  // 🔁 Novo versículo
  function newVerse() {

  setCurrentVerse(null); // limpa versículo da API

  setLoading(true);

  setTimeout(() => {
    const randomVerse = Math.floor(Math.random() * verses.length);
    setIndex(randomVerse);
    setLoading(false);
  }, 400);

}

  // ❤️ Favoritar versículo
  function toggleFavorite(verse: Verse) {
    const exists = favorites.find((v) => v.id === verse.id);

    if (exists) {
      // remove se já existe
      setFavorites(favorites.filter((v) => v.id !== verse.id));
    } else {
      // adiciona
      setFavorites([...favorites, verse]);
    }
  }

  async function fetchVerse() {
    try {
      setLoading(true);

      const verseApi = await getRandomVerse();

      setCurrentVerse(verseApi);
    } catch (error) {
      console.log("Erro ao buscar versículo", error);

      const randomVerse = verses[Math.floor(Math.random() * verses.length)];

      setCurrentVerse(randomVerse);
    } finally {
      setLoading(false);
    }
  }

const verseToShow =
  currentVerse || verses[index] || verseDay;
  
  return (
    <main className={dark ? "container dark" : "container"}>
      <h1 className="title">📖 Aplicativo da Bíblia</h1>

      <div className="buttons">
        <Link href="/favorites">
          <button className="btn-fav-page">⭐ Ver favoritos</button>
        </Link>

        <button className="theme-btn" onClick={() => setDark(!dark)}>
          {dark ? "🌙 Dark" : "☀️ Luz"}
        </button>

        <button className="btn-api" onClick={fetchVerse}>
          🌐 Buscar versículo online
        </button>

        <button className="btn-new" onClick={newVerse}>
          ✨ Novo versículo
        </button>
      </div>

      {verseToShow && (
        <VerseCard
          verse={verseToShow}
          onFavorite={toggleFavorite}
          isFavorite={favorites.some((v) => v.id === verseToShow.id)}
          loading={loading}
        />
      )}
    </main>
  );
}
