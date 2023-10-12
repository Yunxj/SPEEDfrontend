export function approveMatch(style: number) {
  switch (style) {
    case 0:
      return "Pending Review";
    case 1:
      return "Approved";
    case 2:
      return "rejected";
  }
}
