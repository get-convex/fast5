import { Id } from "@convex-dev/server";
import { getRecoil, setRecoil } from "recoil-nexus";
import { addToast } from "./flow";
import { canEdit, currentLetters, currentRow, gameId, submittedRow, username } from "./state";

export function watchKeys(guessWord: any, steal: any) {
  return (event: KeyboardEvent) => {
    let gid = getRecoil(gameId);
    let me = getRecoil(username);
//    console.log(event);
    if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122)) {
      const letter = event.key.toLocaleUpperCase();
      if (getRecoil(canEdit)) {
        setRecoil(currentLetters, (letters) => {
          var letters = [...letters];
          if (letters.length === 5) {
            return letters;
          }
          letters.push(letter);
          return letters;
        });
      }
    } else if (event.key === "Backspace") {
      if (getRecoil(canEdit)) {
        setRecoil(currentLetters, (letters) => {
          var letters = letters.slice(0, -1);
          return letters;
        });
      }
    } else if (event.key === "Enter") {
      if (getRecoil(canEdit) && getRecoil(currentLetters).length === 5) {
        setRecoil(submittedRow, getRecoil(currentRow) as number);
        let letters = getRecoil(currentLetters);
        const tryGuess = async () => {
          let tryWord = letters.join('');
          let validGuess = await guessWord(Id.fromString(gid!), me, tryWord);
          if (!validGuess) {
            addToast(`Invalid word '${tryWord}'`, "error", 5000);
            setRecoil(submittedRow, -1);
            setRecoil(currentLetters, []);
          }
        };
        tryGuess();
      }
    } else if (event.key === '!') {
      const doSteal = async() => {
        if (gid !== null) {
          await steal(Id.fromString(gid), me);
        }
      };
      doSteal()
    }
  };
}