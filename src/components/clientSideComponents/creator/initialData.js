export const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Początek opowieści" },
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: { label: "Koniec opowieści" },
  },
];
export const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
];
