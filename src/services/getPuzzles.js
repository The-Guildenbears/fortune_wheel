export const getPuzzles = async() => {
    // url base for the Wheel of Fortune Database ("wofdb") API call
    // maxLetters property is subject to change in case of cutoff
    const maxLetters = 16;
    const url_base = `https://www.wofdb.com/api/beta/puzzle?maxLetters=${maxLetters}`;

    try {
      // check if API can be reached
      const response = await fetch(url_base);
      if (!response.ok) {
        // something went from with the response
        throw new Error(`Response status: ${response.status}`);
      }//if

      // wait for response
      const result = await response.json();

      // randomly choose six puzzles for the game
      const puzzles = [];
      const puzzleSet = new Set();
      while(puzzleSet.size < 6){
        // pick a random index
        const num = Math.floor(Math.random() * 50);

        // check if puzzle was already chosen or if puzzle exceeds max length
        if(!puzzleSet.has(num) && result.data[num].puzzle.length <= maxLetters){
            // add puzzle to chosen set
            puzzleSet.add(num);

            // each puzzle is an object literal of two string properties
            puzzles.push({
                category: result.data[num].category.name.toUpperCase(),
                puzzle: result.data[num].puzzle.toUpperCase()
            })
        }//if
      }//while

      // return completed puzzle array
      return puzzles;

    } catch (error) {
      // something went wrong somewhere...
      console.error(error.message);

      // return empty array
      return [];
    }//try-catch
}//func