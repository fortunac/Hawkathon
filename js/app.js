$('.dropdown')
    .dropdown({
        action: 'hide',
        onChange: function(value, text, $selectedItem) {
            USStateCounties("#USmap2", parseInt(this.value));
            USState("USmap", parseInt(this.value));
            $('.textfield').html();
            $('#info1').html(this.value);
            $('#info2').html(this.value);
        }

    });

$('#toggle').click(function() {
    $('.ui.labeled.icon.sidebar')
        .sidebar('toggle')
    ;
});

$('.ui.green.menu')
    .on('click', '.item', function() {
        if(!$(this).hasClass('dropdown')) {
            $(this)
                .addClass('active')
                .siblings('.item')
                .removeClass('active');
        }
    });
