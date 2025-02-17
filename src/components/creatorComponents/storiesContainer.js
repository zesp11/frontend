import Link from "next/link";
import "./storiesContainerModule.css";
import StoryTile from "./storyTile";
export default function StoriesContainer() {
  //temporary data
  const data = [
    {
      id: 1,
      name: "W pustyni i w żalu",
      photo: "/about-bg old.jpg",
      tags: ["Romans", "Przygodowe", "Egipt", "Piramidy"],
      place: "Toruń",
      author: "User1223",
    },
    {
      id: 2,
      name: "Szlakiem Kopernika",
      photo: "/about-bg old.jpg",
      tags: ["Przewodnik", "Historia", "Rekreacyjne"],
      place: "Toruń",
      author: "CoolGuy5",
    },
    {
      name: "Toruń 2077",
      photo: "/about-bg old.jpg",
      tags: ["Cyberpunk", "Akcja", "Fikcja"],
      place: "Toruń",
      author: "ILoveToruń",
    },
    {
      name: "Drzwi do Piekielnych Bram",
      photo: "/about-bg old.jpg",
      tags: ["Przygodowe", "Thriller"],
      place: "Warszawa",
      author: "DeviLSlayer666",
    },
    {
      name: "Historia Hanzy",
      photo: "/about-bg old.jpg",
      tags: ["Przewodnik", "Historia"],
      place: "Toruń",
      author: "CoolGuy5",
    },
  ];
  return (
    <div className="storiesContainerWrapper">
      <div className="upperPanel">
        <h2>Znaleziono {data.length} wyników</h2>
        <Link href="/creator/new" className="newStoryButton">
          Dodaj Nową Opowieść
        </Link>
      </div>
      <div className="storyWrapper">
        {data.map((e) => (
          <StoryTile key={e.id} story={e} />
        ))}
      </div>
    </div>
  );
}
