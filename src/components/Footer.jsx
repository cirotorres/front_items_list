export default function Footer() {
  return (
    <footer className="bg-light text-dark py-3 mt-5">
      <div className="container text-center">
        <small>© {new Date().getFullYear()} ItemList • Todos os direitos reservados</small>
      </div>
    </footer>
  );
}
