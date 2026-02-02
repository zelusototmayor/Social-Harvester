class AddProductAndSourceToLeads < ActiveRecord::Migration[8.0]
  def change
    add_reference :leads, :product, foreign_key: true
    add_column :leads, :source_type, :string
    add_column :leads, :source_id, :bigint

    add_index :leads, [:source_type, :source_id]
  end
end
