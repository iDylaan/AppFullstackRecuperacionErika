(() => {
    const pErrorContent = document.querySelector('.error-content');
    const spanErrorNumber = document.querySelector('.error-number');


    const url = window.location;
    const params = new URLSearchParams(url.search);
    pErrorContent.textContent = params.get('error_message');

})();