export const DEFAULT_SECTION_TITLE = 'Section A';

/**
 * Returns true when the sections array contains only the initial
 * placeholder section (titled "Section A" with no questions).
 */
export function isEmptyDefaultSection(
  sections: { title: string; questions?: unknown[] }[]
): boolean {
  return (
    sections.length === 1 &&
    sections[0].title === DEFAULT_SECTION_TITLE &&
    (!sections[0].questions || sections[0].questions.length === 0)
  );
}
