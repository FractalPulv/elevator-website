const players = [
  { name: "Luca", color: "linear-gradient(160deg, #8b85ff, #5b54d6)" },
  { name: "Marta", color: "linear-gradient(160deg, #e07aa3, #b84e6f)" },
  { name: "Dario", color: "linear-gradient(160deg, #46c3b3, #2c8f86)" },
  { name: "Nina", color: "linear-gradient(160deg, #e6c15f, #c19a30)" },
  { name: "Gio", color: "linear-gradient(160deg, #6f9fe0, #406fb0)" },
  { name: "Sara", color: "linear-gradient(160deg, #6fce8a, #3f9e5a)" },
];

// Overlapping player avatars (initials) — "the table".
export function PlayerAvatars({ count = 5 }: { count?: number }) {
  return (
    <div className="avatars" aria-label="Players at the table">
      {players.slice(0, count).map((p) => (
        <span key={p.name} className="avatars__a" style={{ background: p.color }} title={p.name}>
          {p.name[0]}
        </span>
      ))}
    </div>
  );
}
