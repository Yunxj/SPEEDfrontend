export function approveMatch(style: number) {
  switch (style) {
    case 0:
      return "Pending Review";
    case 1:
      return "Approved";
    case 2:
      return "rejected";
      case 3:
    return "release";
    default:
      return " - ";
  }
}
export function averageScoreFunc(num: any, rate: any) {
  let returnData = rate / num;
  console.log("returnData", returnData);
  return isNaN(returnData) ? "" : returnData.toFixed(1);
}
