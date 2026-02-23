export const takeFirstLetters=(name:string)=>{
  return name.split(" ").map((word) => word.charAt(0)).join("");
 }