$(function(){

    $(document).on('click','#drop a', function(){
        // Simulate a click on the file input button
        // to show the file browser dialog
        $(this).parent().find('input:file').click();
    });

    // Prevent the default action when a file is dropped on the window
    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });
});