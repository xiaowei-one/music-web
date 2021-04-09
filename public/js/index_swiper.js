var swiper1 = new Swiper('#swiper-container1', {
    slidesPerView: 5,
    spaceBetween: 30,
    slidesPerGroup: 5,
    preloadImages: false,
    pagination: {
        el: '.list_recommended .swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.list_recommended .swiper-button-next',
        prevEl: '.list_recommended .swiper-button-prev',
    },
});
var swiper2 = new Swiper('#swiper-container2', {
    slidesPerView: 5,
    spaceBetween: 30,
    slidesPerGroup: 5,
});

swiper1.controller.control = swiper2;
swiper2.controller.control = swiper1;

var swiper3 = new Swiper('#swiper-container3', {
    slidesPerView: 3,
    slidesPerGroup: 3,
    slidesPerColumn: 3,
    preloadImages: true,
    updateOnImagesReady: true,
    pagination: {
        el: '.new_song .swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.new_song .swiper-button-next',
        prevEl: '.new_song .swiper-button-prev',
    },
});

var swiper3 = new Swiper('#swiper-container4', {
    slidesPerView: 5,
    slidesPerGroup: 5,
    slidesPerColumn: 2,
    preloadImages: true,
    updateOnImagesReady: true,
    pagination: {
        el: '.mv .swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.mv .swiper-button-next',
        prevEl: '.mv .swiper-button-prev',
    },
});
