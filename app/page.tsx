"use client";

import { useState, useEffect } from "react";
import VerseCard from "@/components/VerseCard";
import { verses } from "@/data/verses";
import { Verse } from "@/types/verse";
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
  const [index, setIndex] = useState(Math.floor(Math.random() * verses.length));

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

  // 🔁 Novo versículo
  function newVerse() {
    setLoading(true);

    setTimeout(() => {
      const random = Math.floor(Math.random() * verses.length);
      setIndex(random);
      setLoading(false);
    }, 400); // tempo da animação
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

      const res = await fetch("https://bible-api.com/john+3:16");
      const data = await res.json();

      const verseApi = {
        id: Date.now(),
        text: data.text,
        reference: data.reference,
      };

      // coloca como versículo atual
      setCurrentVerse(verseApi);

      setLoading(false);
    } catch (error) {
      console.log("Erro ao buscar versículo", error);
      setLoading(false);
    }
  }
  
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

      {(currentVerse || verseDay) && (
        <VerseCard
          verse={currentVerse || verseDay!}
          onFavorite={toggleFavorite}
          isFavorite={favorites.some(
            (v) => v.id === (currentVerse || verseDay!)?.id,
          )}
          loading={loading}
        />
      )}
    </main>
  );
}
