document.addEventListener('DOMContentLoaded', function () {
    var paymentButtons = document.querySelectorAll('#btn');
    const stripe = Stripe('pk_test_51OjoE8BYN32CVb4NBd6GF5CTgTjD061wZoLjgMAs1IJsYYZN2xeFI6MMqIK1ET8t3d6gaXRTkQ03ru82sZsgDGcr009reQO7Hy')
    var paymentModal = document.getElementById('paymentModal');
    const email = document.querySelector('#email');
    const error = document.querySelector(".error")
    paymentButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            paymentModal.classList.add('visible');


            var value = button.value;
            document.getElementById('value').innerHTML = value;
            console.log('Значение кнопки:', value);

            

            window.addEventListener('click', function (event) {
                if (event.target == paymentModal) {
                    closePaymentModal();
                }
            });
        });
    

    function closePaymentModal() {
        paymentModal.classList.remove('visible');
    }
    });
});
