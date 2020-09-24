$(document).ready(function () {
    $('ul.catalogue__tabs').on('click', 'li:not(.active)', function() {
        $(this)
          .addClass('catalogue__tab_active').siblings().removeClass('catalogue__tab_active')
            .closest('div.container').find('div.catalogue__content').removeClass('catalogue__content_active')
            .eq($(this).index()).addClass('catalogue__content_active');
    });

    $('.catalogue-item__link').each(function (i) {
        $(this).on('click', function (e) {
            e.preventDefault();
            $('.catalogue-item__product').eq(i).toggleClass('catalogue-item__product_active');
            $('.catalogue-item__details').eq(i).toggleClass('catalogue-item__details_active');
            $(this).text($(this).text().toLowerCase() == 'подробнее' ? 'назад' : 'подробнее');

        })
    });

    $('[data-modal=consultation').on('click', function () {
        $('.overlay, .js-modal-consultation').fadeIn('slow');
    });

    $('[data-modal=order]').each(function (i) {
        $(this).on('click', function () {
            $('.js-modal-order .modal__description').text($('.catalogue-item__title').eq(i).text());
            $('.overlay, .js-modal-order').fadeIn('slow');
        });
    });


    $('.modal__close, .overlay').on('click', function () {
        $('.overlay').fadeOut('fast');
    });

    $(window).scroll(function () {
        const pageup = $('.pageup');
        if ($(this).scrollTop() > 1600) {
            pageup.fadeIn();
        } else {
            pageup.fadeOut();
        }
    })

    $("a[href^='#']").click(function(){
        const _href = $(this).attr("href");
        $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
        return false;
    });

    const wow = new WOW();

    wow.init({
        mobile: false,
        // offset: 200,
    });

    const slider = tns({
        container: '.js-my-slider',
        items: 1,
        slideBy: 1,
        autoplay: false,
        prevButton: '.js-my-slider-prev',
        nextButton: '.js-my-slider-next',
        navContainer:'.js-my-slider-nav',
        responsive: {
            1: {
                nav: true,
                controls: false,
            //   edgePadding: 20,
            //   gutter: 20,
            //   items: 2
            },
            992: {
                nav: false,
                controls: true,
            //   edgePadding: 20,
            //   gutter: 20,
            //   items: 2
            },
            // 700: {
            //   gutter: 30
            // },
            // 900: {
            // //   items: 3
            // }
          }
    });
});

