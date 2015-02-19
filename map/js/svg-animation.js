
// Lines
if (document.getElementById('test')) {
  var test = Snap.select('#test');
  
  var first = test.select('.first');
  var second = test.select('.second');
  var third = test.select('.third');
  
  first.animate({'stroke-dashoffset': 0}, 1000, mina.bounce, secondArrow);
  function secondArrow() {
   second.animate({'stroke-dashoffset': 0}, 1000, mina.bounce, thirdArrow);
  }; 
  function thirdArrow() {
   third.animate({'stroke-dashoffset': 0}, 1000, mina.bounce);
  }; 
};

// Areas
if (document.getElementById('areaGroup')) {
  var areaGroup = Snap.select('#areaGroup');

  var areaGroupArray = areaGroup.selectAll('path');
  
  var i = 0;

  function animateAreaGroup() {
   
    areaGroupArray[i].animate({'opacity': 0.3}, 1000, mina.easein, animateAreaGroup);
    i++
    console.log(i);
  
   if(i > areaGroupArray.length - 1) {
     return;
    }
  };

  animateAreaGroup();
};



