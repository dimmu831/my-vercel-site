fetch("hhttps://script.google.com/macros/s/AKfycbzToRBXwpG8EqeO_SZYo1Cmmo7IXE6h_PBdP7ok06n2liWKUcYTDwhRzksYgPz7gw/exec")
  .then(res => res.json())
  .then(data => console.log(data));
