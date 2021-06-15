let ajaxurl = leafletOptions.uri;
let elementsTable = [];

// przeniesienie do informacji o mieszkaniu
function scrollTo() {
  window.location.hash = "";
  window.location.hash = '#dane-o-mieszkaniu';
}

// funkcja zdjęć
function showFigure(id, image, thumbnail, alt) {
  let figure = jQuery('<figure></figure>');

  let anchor = jQuery("<a></a>");
  let dataRel = "lightbox-gallery-" + id;

  anchor.attr("data-rel", dataRel);
  anchor.attr("href", image);

  let img = jQuery("<img>");

  img.attr("src", thumbnail);
  img.attr("alt", alt);
  img.addClass("rzut-wrapper-img");

  anchor.append(img);
  figure.append(anchor);

  return figure.prop('outerHTML');
}

// funkcja przycisku
function showNavigation(id, name) {
  let button = jQuery('<button></button>');

  button.attr("type", "button");
  button.attr("data-nav", id);
  button.html(name);

  return button.prop('outerHTML');
}

// aktywowanie slidera zdjęć
function activateSlider() {
  let slider = tns({
    container: '#plan-slider',
    items: 1,
    mouseDrag: true,
    slideBy: 'page',
    startIndex: 1,
    autoplayButton: false,
    autoplayButtonOutput: false,
    controls: false,
    rewind: true,
    nav: true,
    navContainer: document.querySelector("#custom-nav-buttons"),
    speed: 1200,
  });
}

// aktywowanie lightbox
function init_rl() {
  var containers = [];

  jQuery.event.trigger( {
    type: 'doResponsiveLightbox',
    script: rlArgs.script,
    selector: rlArgs.selector,
    args: rlArgs
  } );
}

// Podmiana danych po zmianie apartamentu
function changeData(table) {
  jQuery(".ajax-call").removeClass("active");
  jQuery(".apartment-title").html(table.tytul);
  jQuery(".contact-form .apartment input").val(table.tytul);
  jQuery("#apartment-space").html(table.powierzchnia);
  jQuery("#apartment-attributes").html(table.atrybuty);
  jQuery("#apartment-pdf").attr("href",table.karta_apartamentu.url);
}

// zmiana podświetlenia
function changeActivePath(that, post_id) {
  jQuery(".new-data-image svg path").removeClass("active");
  jQuery(".new-data-image svg path").eq(elementsTable.findIndex(index => index === post_id)).addClass("active");
  jQuery(".apartment-title-wrapper").fadeIn();
  that.addClass("active");
}

function setFigures(table) {
  let images = "";
  let navigation = "";
  let number = 0;
  if(table.hasOwnProperty('rzut') && table['rzut']) {
    images += showFigure(table.id, table.rzut.url, table.rzut.sizes.large, table.plan_pietro.alt);
  }

  if(table.hasOwnProperty('rzut_2') && table['rzut_2']) {
    images += showFigure(table.id, table.rzut_2.url, table.rzut_2.sizes.large, table.plan_pietro.alt);
  }

  jQuery("#view-wrapper").html(images);

  images = "";

  if(table.hasOwnProperty('plan_parter') && table['plan_parter']) {
    images += showFigure(table.id, table.plan_parter.url, table.plan_parter.sizes.large, table.plan_pietro.alt);
    navigation += showNavigation(number, table.plan_parter.title);
    number++;
  }
  if(table.hasOwnProperty('plan_pietro') && table['plan_pietro']) {
    images += showFigure(table.id, table.plan_pietro.url, table.plan_pietro.sizes.large, table.plan_pietro.alt);
    navigation += showNavigation(number, table.plan_pietro.title);
    number++;
  }
  if(table.hasOwnProperty('antresola') && table['antresola']) {
    images += showFigure(table.id, table.antresola.url, table.antresola.sizes.large, table.plan_pietro.alt);
    navigation += showNavigation(number, table.antresola.title);
  }

  jQuery("#plan-slider-wrapper").html("<div id='plan-slider'>" + images + "</div>");

  jQuery("#plan-slider-wrapper").prepend('<div id="custom-nav-buttons" class="tns-nav">' + navigation + '</div>');

  // wywołanie funkcji aktywującej slider zdjęć pięter
  activateSlider();

  // aktywowanie lightbox
  init_rl();
}

// funkcja ajax zmieniająca aktywne mieszkanie
function changeApartment(post_id, first = true) {
  let that = jQuery('.ajax-call[data-id="' + post_id + '"]');

  jQuery('#dane-o-apartamencie').slideUp();

  jQuery.ajax({
    url : ajaxurl,
    type: 'post',
    // dataType: 'json',
    data : {
      post_id : post_id,
      action : 'ajax_load_apartment'
    },
    error : function(response){
      console.log(response);
    },
    success : function(response){
      var table = JSON.parse(response);

      changeData(table);

      // zmiana podświatlanego mieszkania
      if(first) {
        changeActivePath(that, post_id);
      }

      setFigures(table);

      // ustawienie widoczności dla przycisku otwierającego formularz
      if(table.dostepnosc == "Dostępny") {
        jQuery("#contact-form-opener").show();
      } else {
        jQuery("#contact-form-opener").hide();
      }

      jQuery('#dane-o-apartamencie').slideDown();

    }
  });
};

// zmiana aktywnego mieszkania - tabela
jQuery(document).on('click','.ajax-call', function() {
  let that = jQuery(this);
  let post_id = that.data('id');

  changeApartment(post_id);
  scrollTo();
});

// zmiana aktywnego mieszkania - zdjęcie
jQuery(document).on('click','.new-data-image svg path', function(){
  let currentIndex = jQuery(this).index();

  changeApartment(elementsTable[currentIndex]);
  scrollTo();
});

// Zmiana mieszkania - przyciski następny poprzedni
jQuery(document).on('click','#next-project, #prev-project', function(){
  let current = jQuery(".ajax-call.active").data("id");
  let currentIndex = elementsTable.findIndex(index => index === current);

  if(jQuery(this).is( "#next-project" )) {
    currentIndex = currentIndex + 1;
  } else {
    currentIndex = currentIndex - 1;
  }
  if(currentIndex >= 0 && currentIndex < elementsTable.length) {
    changeApartment(elementsTable[currentIndex]);
  }
});

// wywołanie pierwszego mieszkania
jQuery(document).ready(function () {
  changeApartment(elementsTable[0], false);
});

// przypisanie statusów dla mieszkań
jQuery( ".s-data .ajax-call" ).each(function( index ) {
  elementsTable[index] = jQuery(this).data("id");
  jQuery(".new-data-image > svg path").eq(index).addClass(jQuery(this).data("status"));
  jQuery(".new-data-image .marker").eq(index).addClass(jQuery(this).data("status"));
});

//zamknięcie formularza
jQuery(document).on('click', ".contact-form #close" , function(){
  jQuery(".contact-form").fadeOut();
});

// otwarcie formularza
jQuery(document).on('click', "#contact-form-opener" , function(){
  jQuery(".contact-form").fadeIn();
});

// aktywowanie markera nad mieszkaniem po najechaniu
jQuery( ".new-data-image > svg path" )
.mouseenter(function() {
  jQuery(".new-data-image > .marker").eq(jQuery(this).index()).addClass("active");
})
.mouseleave(function() {
  jQuery(".new-data-image > .marker").eq(jQuery(this).index()).removeClass("active");
});
