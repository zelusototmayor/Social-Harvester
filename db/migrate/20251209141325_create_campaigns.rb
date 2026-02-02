class CreateCampaigns < ActiveRecord::Migration[8.0]
  def change
    create_table :campaigns do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :target_handles, array: true, default: []
      t.string :keywords, array: true, default: []
      t.integer :status, default: 0, null: false
      t.datetime :last_scraped_at

      t.timestamps
    end

    add_index :campaigns, :status
  end
end
