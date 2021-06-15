add_action( 'wp_ajax_nopriv_ajax_load_apartment', 'ajax_load_apartment' );
add_action( 'wp_ajax_ajax_load_apartment', 'ajax_load_apartment' );

function ajax_load_apartment() {

  $post_id = $_POST["post_id"];

  $query = new WP_Query( array(
    'p' => $post_id,
    'post_type' => 'any',
    'posts_per_page' => '1',
  ));

  if( $query->have_posts() ):

    while( $query->have_posts() ): $query->the_post();

      $info = "";
      $post_id = get_the_ID();


      $info = get_fields($post_id);

      $info["tytul"] = get_the_title();
      $info["id"] = $post_id;

    endwhile;

  endif;

  echo wp_json_encode($info);
  wp_reset_postdata();

  die();

};
