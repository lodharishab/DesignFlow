export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} DesignFlow. All rights reserved.</p>
        <p className="mt-1">
          Built with <span role="img" aria-label="love">❤️</span> by Your Creative Team
        </p>
      </div>
    </footer>
  );
}
