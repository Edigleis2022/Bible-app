import { Verse } from "@/types/verse";

export async function getRandomVerse(): Promise<Verse> {

  const books = [
    "john",
    "psalms",
    "proverbs",
    "romans",
    "matthew"
  ];

  const randomBook = books[Math.floor(Math.random() * books.length)];
  const randomChapter = Math.floor(Math.random() * 10) + 1;
  const randomVerse = Math.floor(Math.random() * 20) + 1;

  const url = `https://bible-api.com/${randomBook}%20${randomChapter}:${randomVerse}`;

  const res = await fetch(url);
  const data = await res.json();

  return {
    id: Date.now(),
    text: data.text,
    reference: data.reference
  };
}