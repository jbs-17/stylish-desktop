


function _() {
  let a = [];
  const push = PUSH();
  const view = VIEW();
  return {
    push, view
  }

  return function () { return boxx() }


  function PUSH() {
    function get(item) {
      a.push(item)
    }
    return function () { return get() }
  }

  function VIEW() {
    function view() {
      return a
    }
    return function () { return view() }
  }

}

const box = function(){return _()};
export default box;
export {box};

// console.log(box.toString());
// console.log(box1.push.toString());
// console.log(box1.view.toString());