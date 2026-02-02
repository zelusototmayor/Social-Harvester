class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.string :website_url
      t.text :description
      t.text :target_audience
      t.text :pain_points
      t.text :key_features
      t.integer :status

      t.timestamps
    end
  end
end
