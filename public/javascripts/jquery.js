jQuery(document).on( "cp_after_form_submit", function( e, element, response
    , style_slug ) {

    if( false == response.data.error ) {

        if( 'undefined' !== typeof response.data['cfox_data']  ) {
            var form_data = JSON.parse( response.data['cfox_data']  );

            form_data.overwrite_tags = false;

            if( 'undefined' !== typeof convertfox ) {
                convertfox.identify( form_data );
            }
        }
    }

});