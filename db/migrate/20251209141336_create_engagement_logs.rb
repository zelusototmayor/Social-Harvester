class CreateEngagementLogs < ActiveRecord::Migration[8.0]
  def change
    create_table :engagement_logs do |t|
      t.references :lead, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :engagement_type
      t.text :notes
      t.datetime :engaged_at

      t.timestamps
    end
  end
end
