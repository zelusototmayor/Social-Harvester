class CreateUsageRecords < ActiveRecord::Migration[7.1]
  def change
    create_table :usage_records do |t|
      t.references :organization, null: false, foreign_key: true
      t.date :period_start, null: false
      t.date :period_end, null: false
      t.integer :scans_count, null: false, default: 0
      t.integer :leads_count, null: false, default: 0

      t.timestamps
    end

    add_index :usage_records, [:organization_id, :period_start], unique: true
  end
end
