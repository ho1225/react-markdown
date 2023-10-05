import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { NewNote } from "./components/NewNote";
import { useLocalStorage } from "./hook/useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import { NoteList } from "./components/NoteList";

export type Note = {
  id: string;
} & NoteData;

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      console.log([
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ]);
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function addTag(tag: Tag) {
    setTags((prevTags) => [...prevTags, tag]);
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteList />}></Route>
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        ></Route>
        <Route path="/:id">
          <Route index element={<h1>show</h1>}></Route>
          <Route path="edit" element={<h1>edit</h1>}></Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
    </Container>
  );
}

export default App;
