  document.addEventListener("DOMContentLoaded", function() {
    console.log("preloader working");

    $('.preloader-background').delay(1700).fadeOut('slow');

    $('.preloader-wrapper')
      .delay(1700)
      .fadeOut();
  });
 
