  document.addEventListener("DOMContentLoaded", function () {
    console.log("preloader working");

    setTimeout(function () {
      $('#preloader').fadeOut();
      $('.preloader_img').delay(150).fadeOut('slow');
    }, 1000);
  });