$('.dropdown')
    .dropdown({
        action: 'hide',
        onChange: function(value, text, $selectedItem) {
            USStateCounties("#USmap", parseInt(this.value));
            $('.textfield').html();
            $('#info1').html(this.value);
            $('#info2').html(this.value);
        }

    })


;

$('#toggle').click(function() {
    alert( 'happening' );


});