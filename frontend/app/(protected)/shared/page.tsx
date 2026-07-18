export default function SharedPage() {
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <h1 className="font-display font-semibold text-xl mb-2">Partagés</h1>
      <p className="text-sv-text2 text-sm mb-6">
        Le suivi de vos liens de partage actifs arrive bientôt. En attendant, vous pouvez
        créer un lien de partage directement depuis la Galerie ou un Album.
      </p>
      <a href="/gallery" className="inline-block bg-sv-accent text-[#04150e] font-bold rounded-lg px-4 py-2 text-sm">
        Aller à la Galerie
      </a>
    </div>
  );
}