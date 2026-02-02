class CreateScannedPosts < ActiveRecord::Migration[7.1]
  def change
    create_table :scanned_posts do |t|
      t.string :post_url, null: false
      t.string :shortcode, null: false
      t.references :source, polymorphic: true, null: false
      t.references :product, null: false, foreign_key: true
      t.datetime :first_scanned_at, null: false

      t.timestamps
    end

    add_index :scanned_posts, [:source_type, :source_id, :shortcode], unique: true, name: 'index_scanned_posts_on_source_and_shortcode'
  end
end
