// Fizzbuzz calculator
var fizzbuzz = function(n) {
  
  var str = " ";
  for (i = 1; i <=n; i++){
    if (i % 3 == 0 && i % 5 == 0) {
        str += "Fizzbuzz ";
    }
    else if (i % 3 == 0) {
        str += "Fizz ";
    }
    else if (i % 5 == 0) {
        str += "Buzz ";
    }
    else {
        str += i + ' ';
    }
  }


  return str;
};

module.exports = fizzbuzz;