const Task = (function() {
  function getAnswer(arr) {
    let maxSum = 0;
    for (let i = 0; i < arr.length; i++) {
      let tempSum = 0;
      for (let j = i; j < arr.length; j++) {
        tempSum += arr[j];
        if (tempSum > maxSum) maxSum = tempSum;
      }
    }
    return maxSum;
  }

  function test() {
    const data = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    console.log("Data: ", data);
    console.log("Solution: ", getAnswer(data));
  }

  return {
    getAnswer: getAnswer,
    test: test
  }
}())
