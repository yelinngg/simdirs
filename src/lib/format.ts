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
