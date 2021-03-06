const albumsController = {};

albumsController.getAlbums = async (req, res) => {
  if (req.query.search !== undefined) {
    await req.app.locals.spotifyApi
      .searchAlbums(req.query.search, { limit: 25, market: ['JP', 'PA', 'US'] })
      .then(
        (data) => {
          res.render('albums/albumsSearch', {
            lang: req.language,
            searchResults: data.body.albums.items,
            searchValue: req.query.search,
            title: `${req.t('common:app_name')} -
                    ${req.t('albums:search_albums')}`,
            user: req.user,
            meta_description: req.t(`index:album_section_description`),
          });
        },
        (err) => {
          res.render('error', { error: err });
        },
      );
  } else {
    res.render('albums/albumsSearch', {
      lang: req.language,
      user: req.user,
      title: `${req.t('common:app_name')} -
      ${req.t('albums:search_albums')}`,
      meta_description: req.t(`index:album_section_description`),
    });
  }
};

albumsController.getAlbum = async (req, res) => {
  const album = {};
  await req.app.locals.spotifyApi.getAlbum(req.params.id).then(
    (data) => {
      album.info = data.body;
    },
    (err) => {
      res.render('error', { error: err });
    },
  );
  await req.app.locals.spotifyApi
    .getAlbumTracks(req.params.id, { limit: 50 })
    .then(
      (data) => {
        album.tracks = data.body;
        res.render('albums/albumDetails', {
          album,
          lang: req.language,
          title: `${req.t('common:app_name')} -
          ${req.t('common:album')} -
          ${album.info.name}`,
          user: req.user,
          meta_description: req.t(`index:album_section_description`),
        });
      },
      (err) => {
        res.render('error', { error: err });
      },
    );
};

module.exports = albumsController;
