class CreateHashtags < ActiveRecord::Migration[8.0]
  def change
    create_table :hashtags do |t|
      t.references :product, null: false, foreign_key: true
      t.string :tag, null: false
      t.string :platform, null: false, default: 'instagram'
      t.string :status, null: false, default: 'active'
      t.datetime :last_scraped_at
      t.integer :scrape_count, default: 0

      t.timestamps
    end

    add_index :hashtags, [:product_id, :tag, :platform], unique: true
    add_index :hashtags, :status
  end
end
