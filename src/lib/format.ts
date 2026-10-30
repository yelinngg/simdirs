/**
 * Rough reading time for a note, in whole minutes.
 *
 * A note is a promise about time: the reader wants to know whether this is a
 * two-minute check or a twenty-minute comparison before opening it. Markdown
 * syntax is stripped first, then Han characters and Latin words are counted
 * separately — the notes mix both ("giffgaff 的 180 天规则"), and counting a
 * Latin word as five Chinese characters would overstate every estimate.
 */
export function readingTime(body: string | undefined): number | null {
  if (!body) return null;

  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~|]/g, ' ')
    .trim();

  // ~350 Han characters or ~220 Latin words a minute for a technical note.
  const han = text.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const words = text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;

  return Math.max(1, Math.round(han / 350 + words / 220));
}

/**
 * Trims a spec string down to what fits on a card row without losing the point.
 *
 * `validity` values run up to 102 characters ("180d on activation; +92d per
 * EUR2 …; 270d recharge window"). A card row has room for roughly two lines, so
 * the whole sentence becomes an ellipsis. Short values are left alone: cutting
 * "Flexible (1–90 days)" down to "Flexible" drops the only useful part.
 *
 * The full string stays on the detail page and in the card's `title`.
 */
export function leadClause(value: string, max = 40): string {
  // A semicolon is a real clause boundary in these values.
  let out = value.split(/[;；]/)[0].trim();

  // Splitting on ";" can land inside brackets: "90 days per activity (credit
  // expiry; number terminated …)" leaves an open parenthesis. Drop it.
  const opened = out.match(/[（(]/g)?.length ?? 0;
  const closed = out.match(/[)）]/g)?.length ?? 0;
  if (opened > closed) out = out.slice(0, out.search(/[（(]/)).trim();

  if ([...out].length > max) {
    // Bracketed text is usually a qualifier, so it goes first — but only when
    // what precedes it can stand on its own.
    const head = out.split(/[（(]/)[0].trim();
    if ([...head].length >= 12) out = head;
  }

  if ([...out].length > max) {
    // Still a sentence: the comma is where these values put the caveat
    // ("90d activity rule, then 0.50 GEL/day fee until zero balance").
    const comma = out.search(/[,，]/);
    if (comma > 0) out = out.slice(0, comma).trim();
  }

  return out.replace(/[,:：、，]$/, '').trim() || value.trim();
}
