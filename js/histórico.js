const loggedIn = localStorage.getItem('myHealthLoggedIn');
if (!loggedIn) {
  window.location.href = "login.html";
}