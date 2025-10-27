export const getPuzzles = async() => {
    //url base for the Wheel of Fortune Database ("wofdb") API call
    const url_base = "https://www.wofdb.com/api/beta/puzzle?maxLetters=24"

    try {
      const response = await fetch(url_base);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }//if

      //wait for response
      const result = await response.json();

      //randomly choose six puzzles for the game
      const puzzles = [];
      const puzzleSet = new Set();
      while(puzzleSet.size < 6){
        const num = Math.floor(Math.random() * 50);
        //check if puzzle was already chosen
        if(!puzzleSet.has(num)){
            //add puzzle to chosen set
            puzzleSet.add(num);

            //each puzzle is an object literal
            puzzles.push({
                category: result.data[num].category.name.toUpperCase(),
                puzzle: result.data[num].puzzle.toUpperCase()
            })
        }//if
      }//while

      //show puzzle data in console for debugging purposes
      //comment out to prevent cheating in final game
      //console.log(puzzles);
      return puzzles;

    } catch (error) {
      //something went wrong somewhere...
      console.error(error.message);
      return [];
    }//try-catch
}//func