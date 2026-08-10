/** Clickable section heading with anchor link — shows "#" on hover */
export function SectionHeading({
  id,
  page,
  children,
}: {
  id: string;
  page: string;
  children: React.ReactNode;
}) {
  const handleClick = () => {
    const hash = `${page}:${id}`;
    window.location.hash = hash;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <h2
      id={id}
      className="text-2xl font-semibold mb-2 group cursor-pointer scroll-mt-6"
      onClick={handleClick}
    >
      {children}
      <a
        href={`#${page}:${id}`}
        className="ml-2 opacity-0 group-hover:opacity-60 transition-opacity text-secondary-foreground"
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
        aria-label={`Link to ${children}`}
      >
        #
      </a>
    </h2>
  );
}
