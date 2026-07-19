import MemoryCard from '../components/MemoryCard';
import './Memories.css';

export default function Memories({ memories }) {
  return (
    <div className="memories-page">
      <header className="page-header">
        <h1 className="text-title">El Baúl de los Recuerdos</h1>
        <p className="text-subtitle">Nuestra historia, un momento a la vez ✨</p>
      </header>

      <div className="memories-feed">
        {memories.length === 0 ? (
          <div className="empty-state">
            <p>Aún no hay recuerdos.</p>
            <p>¡Completa citas de tu wishlist para llenar el baúl!</p>
          </div>
        ) : (
          memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))
        )}
      </div>
    </div>
  );
}
