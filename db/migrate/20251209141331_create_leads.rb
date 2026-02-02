class CreateLeads < ActiveRecord::Migration[8.0]
  def change
    create_table :leads do |t|
      t.references :campaign, null: false, foreign_key: true
      t.string :source_post_url
      t.string :source_username
      t.string :commenter_username
      t.string :commenter_profile_url
      t.text :comment_text
      t.datetime :comment_timestamp
      t.decimal :intent_score, precision: 3, scale: 2
      t.integer :intent_category, default: 0
      t.text :ai_suggested_reply
      t.integer :status, default: 0, null: false
      t.string :external_comment_id

      t.timestamps
    end

    add_index :leads, :external_comment_id, unique: true
    add_index :leads, :status
    add_index :leads, :intent_score
    add_index :leads, [:campaign_id, :status]
  end
end
