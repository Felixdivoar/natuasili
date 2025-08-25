import { useEffect } from "react";

export default function Partners() {
  // Hide any global booking overlay if it was left open
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".na-cta-bar,.na-btn-book-fab,.booking-modal")
      .forEach(el => el.style.display = "");
  }, []);

  return (
    <main id="site-main" className="page-content">
      <section className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Partners</h1>
        <p className="text-muted-foreground max-w-2xl">
          Work with NatuAsili to power conservation and community impact.
        </p>
        {/* Rest of partners content... */}
      </section>
    </main>
  );
}