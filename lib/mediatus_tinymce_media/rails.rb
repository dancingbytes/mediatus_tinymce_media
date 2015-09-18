module MediatusTinymceMedia

  class Engine < ::Rails::Engine

    initializer 'MediatusTinymceMedia.assets_pipeline' do |app|
      app.config.assets.precompile << "tinymce/plugins/mediatusmedia/*"
    end

  end # Engine

end # MediatusTinymceMedia
