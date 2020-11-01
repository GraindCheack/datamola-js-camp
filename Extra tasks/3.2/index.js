const Task = (function() {
  function canBuy(arr, id) {
    for (let i = id + 1; i < arr.length; i++) {
      if (arr[i] > arr[id]) return true
    }
    return false
  }
  
  function getAnswer(arr) {
    let maxSum = 0
    for (let i = 0; i < arr.length; i++) {
      if (canBuy(arr, i)) {
        for (let j = i + 1; j < arr.length; j++){
          if (arr[j] > arr[i]) {
            const tempSum = arr[j] - arr[i] + getAnswer(arr.slice(j + 1))
            if (tempSum > maxSum) maxSum = tempSum
          }
        }
      }
    }
    return maxSum
  }

  function test() {
    console.log('Data: ', [7,1,5,3,6,4]);
    console.log('Solution: ', getAnswer([7,1,5,3,6,4]));
    console.log('------------');
    console.log('Data: ', [1,2,3,4,5]);
    console.log('Solution: ', getAnswer([1,2,3,4,5]));
    console.log('------------');
    console.log('Data: ', [7,6,4,3,1]);
    console.log('Solution: ', getAnswer([7,6,4,3,1]));
  }

  return {
    getAnswer: getAnswer,
    test: test
  }
}())

