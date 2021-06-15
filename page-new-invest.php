<?php
/**
 * Template name: Nowa inwestycja
 */
?>
<?php get_header(); ?>
<?php $fields = get_fields(); ?>

  <section class="new-main-image position-relative">
    <?php show_img($fields["glowne_zdjecie"]); ?>
    <div class="text-center icon">
      <?php include(get_template_directory(). "/icons/slider-z-mysla-o-tobie-2.svg"); ?>
    </div>
  </section>

  <section class="container container-thin pt-80">
    <?php the_content(); ?>
  </section>

  <?php 
  $args = array( 'post_type' => 'mieszkania', 'post_status' => 'publish', 'post_per_page' => -1 );
  
  $loop = new WP_Query( $args ); ?>
  <?php
    while ( $loop->have_posts() ) :
      $loop->the_post();
      $page_id = get_the_ID();
      $part = get_fields($page_id);
      $apartments[$page_id] = $part;
      $apartments[$page_id]["title"] = get_the_title();
      $apartments[$page_id]["id"] = $page_id;
    endwhile; wp_reset_query(); 
  ?>

  <section class="new-data-image position-relative">
    <?php show_img($fields["mieszkania"]["jpg"]); ?>
    <?php include(get_template_directory(). "/icons/rysunek.svg"); ?>
    <div class="apartment-title-wrapper" style="display: none;">
      <div class="container">
        <h2 class="text-uppercase text-white"><?= $fields["apartament"]; ?> <span class="apartment-title"></span></h2>
      </div>
    </div>
    <?php
    $i = 1;
    foreach($apartments as $piece) { ?>
      <div class="marker marker-<?= $i; ?>">
        <?= $piece["title"]; ?>
        <?php include(get_template_directory(). "/icons/magnifier.svg"); ?>
      </div>
      <?php
      $i++;
    } ?>
  </section>

  <section class="s-data position-relative pb-60">
    <div class="container container-thin">
      <div class="grid grid-2">
        <?php
          $pieces = array_chunk($apartments, ceil(count($apartments) / 2));
        ?>
        <?php
        foreach ($pieces as $piece) { ?>
          <div class="half">
            <table>
              <tr class="top text-uppercase text-white pb-50">
                <th>
                  <?= $fields["numer"]; ?>
                </th>
                <th>
                  <?= $fields["powierzchnia"]; ?>
                </th>
                <th>
                  <?= $fields["dostepnosc"]; ?>
                </th>
                <th class="text-right">
                  <?= $fields["plan"]; ?>
                </th>
              </tr>
              <?php
              $color = "";
              foreach ($piece as $key => $apartment) {
                switch ($apartment["dostepnosc"]) {
                  case 1:
                    $color = "red";
                    break;

                  case 2:
                    $color = "gray";
                    break;

                  default:
                    $color = "green";
                    break;
                }
                ?>
                <tr class="bottom ajax-call" data-status="<?= $color; ?>" data-id="<?= $apartment["id"]; ?>">
                  <td>
                    <?= $fields["apartament"]; ?> <?= $apartment["title"]; ?>
                  </td>
                  <td>
                    <?= $apartment["powierzchnia"]; ?> m<sup>2</sup>
                  </td>
                  <td class="dostepnosc"><?= $apartment["dostepnosc"]; ?></td>
                  <td class="plan">
                    <button>
                  		<?php include(get_template_directory(). "/icons/magnifying-glass.svg"); ?>
                    </button>
                  </td>
                </tr>
              <?php } ?>
            </table>
          </div>
        <?php } ?>
      </div>
    </div>
    <div id="dane-o-mieszkaniu"></div>
  </section>

  <section id="dane-o-apartamencie" class="s-data-more pt-60 pb-70 position-relative">
    <div class="container container-thin">
      <div class="header flex justify-content-end align-items-center pb-50">
        <div id="apartment-title">
          <h2>
            <?= $fields["plan_apartamentu"]; ?> <span class="apartment-title"></span>
          </h2>
          <button id="prev-project">
            <?php include(get_template_directory(). "/icons/arrow-bottom.svg"); ?>
          </button>
          <button id="next-project">
            <?php include(get_template_directory(). "/icons/arrow-bottom.svg"); ?>
          </button>
        </div>
        <a id="apartment-pdf" target="_blank" class="btn mr-15 dark" href="">
          <?php include(get_template_directory(). "/icons/contract.svg"); ?>
          <?= $fields["pobierz_karte"]; ?>
        </a>
        <button id="contact-form-opener" class="btn">
          <?php include(get_template_directory(). "/icons/envelope.svg"); ?>
          <?= $fields["zapytaj"]; ?>
        </button>
      </div>
      <div class="grid-top grid pt-80">
        <div>
          <div class="flex justify-content-between pb-30">
            <figure>
              <?php include(get_template_directory(). "/icons/sketch.svg"); ?>
            </figure>
            <div id="apartment-attributes"></div>
            <div>
              <h3>
                <strong>
                  <?= $fields["powierzchnia_calkowita"]; ?>
                  <span id="apartment-space"></span> <?= $fields["jednostka"]; ?>
                </strong>
              </h3>
            </div>
          </div>
          <div id="view-wrapper"></div>
        </div>
        <div id="plan-slider-wrapper" class="text-center"></div>
      </div>
    </div>
  </section>

  <?php echo get_template_part("parts/text_with_icon", null, array('icon' => "ogrzewanie", 'tekst' => $fields["tekst"]; ) ); ?>

  <section class="container container-thin pb-70">
    <?php
      $gallery = get_field("galeria");
      if(!empty($gallery)) {
        echo get_template_part("parts/gallery", null, array('gallery' => $gallery; ) );
      }
    ?>
  </section>

  <section class="contact-form">
    <div class="container">
      <button id="close">
        <?php include(get_template_directory(). "/icons/cross.svg"); ?>
      </button>
      <h3>
        <?= $fields["zapytanie_odnosnie"]; ?><span class="apartment-title"></span>
      </h3>
      <?= do_shortcode( '[contact-form-7 id="372" title="Formularz kontaktowy"]' ); ?>
    </div>
  </section>

<?php get_footer(); ?>
